#!/usr/bin/env node

import { readFile } from 'fs/promises'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import ora from 'ora'

import {
    buildApplication,
    publishApplication
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
    .command(
        'publish-application',
        `Publish the application bundle.`,
        async (opts) => {
            const progress = ora({
                isSilent: opts['no-progress'] === true,
                text: 'Publishing kiddo application...'
            }).start()

            try {
                const result = await publishApplication(process.cwd(), opts)

                console.log('^^^^',result)

                progress.info(`Kiddo application publish metadata: ${JSON.stringify(result)}`)
                progress.succeed('Kiddo application publishing successfully completed')
            } catch (error) {
                progress.fail(`Error happened while publishing kiddo application: ${error.message}`)

                process.exitCode = 1
            } finally {
                progress.stop()
            }
        }
    )
    .strict()
    .help()
    .argv