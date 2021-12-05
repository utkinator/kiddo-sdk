import path from 'path'
import {
    getRuntimeContextKey,
    getRootElementId
} from 'kiddo-runtime'

import { loadJsonFile } from '../../utils/load-json-file.js'

export const readApplicationInfo = async (appPath, opts) => {
    let pkgJson

    try {
        pkgJson = await loadJsonFile(path.resolve(appPath, 'package.json'))
    } catch (error) {
        throw new Error(`package.json file is missing at the supplied '${appPath}' path: ${error}`)
    }

    const {
        name,
        version
    } = pkgJson

    return {
        name,
        version,
        path: appPath,
        rootElelementId: getRootElementId(name, version),
        runtimeContextKey: getRuntimeContextKey(name, version),
    }
}
