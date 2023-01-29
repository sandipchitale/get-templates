# Helm plugin - get-templates

This ```helm``` plugin supports the following custom ```helm``` commands.

## Custom helm commands

```
helm get-templates [--code] RELEASENAME [--revision n] [--n NAMESPACENAME]
```

--code option specifies to use VSCode to show the templates.

## Building

```
npm install
npm run pkg
```

## Use it locally

- Add the ```dist/YOURPLATFORM/bin``` folder to your PATH variable.

- Confirm that ``kubectl``` is able to see the plugin by doing the following:

```
helm plugin list
```

- Invoke the plugin as shown above.


## Installation of the plugin

DOwnload and extract the archive for your platform, extract it, cd to that folder and then install it using:

```
helm plugin install .
```

You may have to run this command from administrator cmd window.
