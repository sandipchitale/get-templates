# Kubectl plugin - helm

This ```helm``` plugin supports the following custom ```helm``` commands.

## Custom helm commands

```
helm get-templates RELEASENAME [--revision n] [--namespace NAMESPACENAME]
```

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

Once the plugin is available on [krew-index](), install it like this:

```
helm install get-templates
```