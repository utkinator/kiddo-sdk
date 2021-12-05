#!/usr/bin/env node

import { readFile } from 'fs/promises'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import ora from 'ora'

import {
    buildApplication
} from '../lib/application/index.js'

const pkgJson = JSON.parse(
    await readFile(
        new URL('../package.json', import.meta.url)
    )
)

const argv = yargs(hideBin(process.argv))
    .scriptName('kiddo-sdk')
    .version(pkgJson.version)
    .command(
        'build-application',
        `Build the application bundle. Output is saved at the 'dist' directory`,
        async (opts) => {
            const progress = ora({
                isSilent: opts['no-progress'] === true,
                text: 'Building kiddo application...'
            }).start()

            try {
                const result = await buildApplication(process.cwd(), opts)

                progress.info(`Kiddo application metadata: ${JSON.stringify(result)}`)
                progress.succeed('Kiddo application bundling successfully completed')
            } catch (error) {
                progress.fail(`Error happened while bundling kiddo application: ${error.message}`)

                process.exitCode = 1
            } finally {
                progress.stop()
            }
        }
    )
    .strict()
    .help()
    .argv