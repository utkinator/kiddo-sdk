import { readFile } from 'fs/promises'

const pkgJson = JSON.parse(
    await readFile(
        new URL('../package.json', import.meta.url)
    )
)

export const makeCommonMetadata = () => {
    return {
        buildTimestamp: (new Date()).toISOString(),
        buildTool: {
            name: pkgJson.name,
            version: pkgJson.version
        }
    }
}