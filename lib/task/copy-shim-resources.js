const ui5Logger = require('@ui5/logger')

const _log = ui5Logger.getLogger('ui5-task-copy-shim-resources')

/**
 * Copy a single resource
 *
 * @param {object} parameters Parameters
 * @param {module:@ui5/fs.DuplexCollection} parameters.workspace DuplexCollection to read and write files
 * @param {module:@ui5/fs.Resource} parameters.resource Resource to be copied
 * @param {boolean} parameters.debug Enable debug logs
 */
const _copyResource = async ({ workspace, resource, debug }) => {
  if (debug) {
    _log.info(`Copying resource ${resource.getPath()}`)
  }
  await workspace.write(resource)
}

/**
 * Copy a list of resources indentified by paths
 *
 * @param {object} parameters Parameters
 * @param {module:@ui5/fs.DuplexCollection} parameters.workspace DuplexCollection to read and write files
 * @param {module:@ui5/fs.AbstractReader} parameters.dependencies Reader or Collection to read dependency files
 * @param {string[]} parameters.paths Virtual paths
 * @param {boolean} parameters.debug Enable debug logs
 */
const _copyPaths = async ({ workspace, dependencies, paths, debug }) => {
  for (const path of paths) {
    if (debug) {
      _log.info(`Resolving path ${path}`)
    }
    const resource = await dependencies.byPath(path)
    _copyResource({ workspace, resource, debug })
  }
}

/**
 * Copy a list of resources identified by globs
 *
 * @param {object} parameters Parameters
 * @param {module:@ui5/fs.DuplexCollection} parameters.workspace DuplexCollection to read and write files
 * @param {module:@ui5/fs.AbstractReader} parameters.dependencies Reader or Collection to read dependency files
 * @param {string[]} parameters.globs Glob pattern as string for virtual directory structure
 * @param {boolean} parameters.debug Enable debug logs
 */
const _copyGlobs = async ({ workspace, dependencies, globs, debug }) => {
  for (const glob of globs) {
    if (debug) {
      _log.info(`Resolving glob ${glob}`)
    }
    const resources = await dependencies.byGlob(glob)
    for (const resource of resources) {
      _copyResource({ workspace, resource, debug })
    }
  }
}

/**
 * Copy resources task
 *
 * @param {object} parameters Parameters
 * @param {module:@ui5/fs.DuplexCollection} parameters.workspace DuplexCollection to read and write files
 * @param {module:@ui5/fs.AbstractReader} parameters.dependencies Reader or Collection to read dependency files
 * @param {object} parameters.taskUtil Specification Version dependent interface to a [TaskUtil]{@link module:@ui5/builder.tasks.TaskUtil} instance
 * @param {object} parameters.options Options
 * @param {string} parameters.options.projectName Project name
 * @param {string} [parameters.options.projectNamespace] Project namespace if available
 * @param {string} [parameters.options.configuration] Task configuration if given in ui5.yaml
 * @returns {Promise<>} Promise resolving with <code>undefined</code> once data has been written
 */
module.exports = async function ({ workspace, dependencies, options }) {
  const { configuration = {} } = options
  const { enabled = true, debug = false, paths = [], globs = [] } = configuration
  if (!enabled) {
    return
  }
  await Promise.all([
    _copyPaths({ workspace, dependencies, paths, debug }),
    _copyGlobs({ workspace, dependencies, globs, debug })
  ])
}
