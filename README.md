[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# ui5-task-copy-resources
Custom UI5 task for copying runtime resources at build time.

This is especially useful if you have some [ProjectShims](https://sap.github.io/ui5-tooling/pages/extensibility/ProjectShims/) e.g. for npm dependencies which should also be available in final the build.

## Prerequisites
Make sure your project is using the latest [UI5 Tooling](https://sap.github.io/ui5-tooling/pages/GettingStarted/).

## Getting started

### Install

#### Custom task
Add the custom task as _development dependency_ to your project.

With `yarn`:
```sh
yarn add -D ui5-task-copy-resources
```
Or `npm`:
```sh
npm i -D ui5-task-copy-resources
```

Additionally the custom task needs to be manually defined as a _ui5 dependency_ in your project's `package.json`:
```json
{
  "devDependencies": {
    "ui5-task-copy-resources": "^0.1.0"
  },
  "ui5": {
    "dependencies": [
      "ui5-task-copy-resources"
    ]
  }
}
```

### Configure

#### Custom task
Register the custom task in your project's `ui5.yaml` under `builder/customTasks`:
```yaml
specVersion: "2.2"
metadata:
  name: my-app
type: application
# ...
# further configuration
# ...
builder:
  customTasks:
    - name: ui5-task-copy-resources
      afterTask: replaceVersion
      configuration:
        paths:
          - "/thirdparty/core-js-bundle/minified.js"
          - "/thirdparty/regenerator-runtime/runtime.js"
        globs:
          - "/thirdparty/lodash/*.js"
# ...
# further configuration
# ...
---
# Shims for thirdparty modules
specVersion: "2.2"
kind: extension
type: project-shim
metadata:
  name: thirdparty-shims
shims:
  configurations:
    # polyfill for ECMAScript features
    core-js-bundle:
      specVersion: "2.2"
      type: module
      metadata:
        name: core-js-bundle
      resources:
        configuration:
          paths:
            /thirdparty/core-js-bundle/: ""
    # transpile generator functions (~ async await)
    regenerator-runtime:
      specVersion: "2.2"
      type: module # Use module type
      metadata:
        name: regenerator-runtime
      resources:
        configuration:
          paths:
            /thirdparty/regenerator-runtime/: ""
    # lodash utility library
    lodash:
      specVersion: "2.2"
      type: module
      metadata:
        name: lodash
      resources:
        configuration:
          paths:
            /thirdparty/lodash/: ""
```

### Usage
Simply run e.g. `ui5 build --clean-dest` to copy your runtime resources during build time.
Once the build is completed the copied resources will available in the `dist` folder.


### Additional configuration

#### Options
The custom task accepts the following `configuration` options:

|  name   |   type   | Description                                                                                | mandatory |   default   |                examples                |
|:-------:|:--------:|:------------------------------------------------------------------------------------------:|:---------:|:-----------:|:--------------------------------------:|
| enabled |  boolean | enable/disable the custom task                                                             |     no    |   `true`    |             `true`, `false`            |
| debug   |  boolean | enable/disable debug logs                                                                  |     no    |   `false`   |             `true`, `false`            |
| paths   | string[] | paths for resources to be copied                                                           |     no    |   `[]`      | `[ "some/resource/path.js" ]`           |
| files   | string[] | glob pattern for resources to be copied                                                    |     no    | `[]`        | `[ "some/resource/glob/**/*.js" ]`        |

```yaml
builder:
  customTasks:
    - name: ui5-task-copy-resources
      afterTask: replaceVersion
      configuration:
        enabled: true
        debug: true
        paths:
          - "/thirdparty/core-js-bundle/minified.js"
          - "/thirdparty/regenerator-runtime/runtime.js"
        globs:
          - "/thirdparty/lodash/*.js"
```
