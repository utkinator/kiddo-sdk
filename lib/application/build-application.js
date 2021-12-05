import path from 'path'
import { writeFile, mkdir } from 'fs/promises'

import {
    readApplicationInfo,
    makeApplicationMetadata
} from './index.js'

import {
    OUTPUT_DIR
} from '../constants.js'

export const buildApplication = async (appPath, opts) => {
    console.log(`\nGoing to build ${appPath} with ${JSON.stringify(opts)} options`)

    const applicationInfo = await readApplicationInfo(appPath)
    const outputPath = path.join(applicationInfo.path, OUTPUT_DIR)

    await mkdir(outputPath, { recursive: true })

    const metadata = makeApplicationMetadata(applicationInfo, opts)

    await writeFile(
        path.resolve(outputPath, 'metadata.json'),
        JSON.stringify(metadata)
    )

    return {
        outputPath,
        metadata
    }
}
