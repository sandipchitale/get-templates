"use strict";

import minimist from 'minimist';
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'
import * as zlib from 'zlib';
import * as child_process from 'child_process';


const getTemplatesUsage = `
get-templates (v0.0.6)

helm get-templates RELEASE_NAME [--revision REVISION] [-n NAMESPACE]]

--code option specifies to use VSCode to show the templates.
`;

(async () => {
    let rest = process.argv.slice(2);
    let optsAndCommands = minimist(rest);
    if (optsAndCommands._.length === 1) {

        const code = optsAndCommands.code || false;

        // namespace if a keyword, use a different name for the constant
        const ns = optsAndCommands.n;

        const release = optsAndCommands._[0];

        // revsion not specified, get the latest revision
        let revision = optsAndCommands.revision; // start with default
        if (!revision) {
            revision = 1;
            const helmList = child_process.execSync(`helm list ${ns ? `-n ${ns}` : ''} -o json`, {
                encoding: 'utf8'
            });
            if (helmList) {
                try {
                    const helmListJSON = JSON.parse(helmList) as any[];
                    helmListJSON.forEach((releaseObject: any) => {
                        if (releaseObject.name === release) {
                            revision = releaseObject.revision;
                        }
                    });
                } catch (e) {
                }
            }
        }

        const secretName = `sh.helm.release.v1.${release}.v${revision}`;
        try {
            const secretBuffer = child_process.execSync(`kubectl get secret ${secretName} -o go-template="{{.data.release | base64decode }}" ${ns ? `-n ${ns}` : ''}`, {
                encoding: 'utf8'
            });
            if (secretBuffer) {
                const inflated = zlib.gunzipSync(Buffer.from(secretBuffer, 'base64'));
                try {
                    let templates = '';
                    const helmGetAllJSON: any = JSON.parse(inflated.toString('utf8'));
                    helmGetAllJSON.chart.templates.forEach((template: any) => {
                        const templateString = Buffer.from(template.data, 'base64').toString('utf-8');
                        templates += `\n---\n# Template: ${template.name}\n${templateString}`;
                        template.data = templateString;
                    });
                    templates = templates.split('\\n').join('\n');
                    templates = `# templates for release: ${release} revision: ${revision} ${ns ? ` in namespace ${ns}` : ' in current namespace'}\n${templates}`
                    if (code) {
                        const templatesFilePath = path.join(os.tmpdir(), `helm-templates-${release}-${revision}.yaml`);
                        fs.writeFileSync(templatesFilePath, templates);
                        child_process.execSync(`code -r ${templatesFilePath}`);
                    } else {
                        console.info(templates);
                    }
                } catch (e) {
                }
            } else {
                console.error(`Could not find secret ${secretName}`);
                return;
            }
        } catch (e) {
            console.error(e);
            return;
        }
    } else {

        console.info(getTemplatesUsage);
    }
})();
