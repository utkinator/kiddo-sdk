import os from 'os'
import path from 'path'
import fs from 'fs'
import tar from 'tar'
import fetch from 'node-fetch'
import FormData from 'form-data'

import {
    readApplicationInfo
} from './index.js'

import {
    OUTPUT_DIR
} from '../constants.js'

export const publishApplication = async (appPath, opts) => {
    const applicationInfo = await readApplicationInfo(appPath)
    const appToCompress = path.join(applicationInfo.path, OUTPUT_DIR)

    console.log(`\nGoing to publish ${appToCompress} with ${JSON.stringify(opts)} options`)

    const file = path.join(
        os.tmpdir(),
        `${applicationInfo.name}-${applicationInfo.version}-${Date.now()}.tgz`
    )

    tar.c(
        {
            gzip: true,
            file: file
        },
        [appToCompress]
    ).then(async () => {
        const form = new FormData();
        const stats = fs.statSync(file);
        const fileSizeInBytes = stats.size;
        const fileStream = fs.createReadStream(file);

        form.append('file', fileStream, { knownLength: fileSizeInBytes });

        const response = await fetch(
            'http://localhost:3100/api/assets/upload',
            {
                method: 'POST',
                body: form
            }
        );

        if (!response.ok) {
            return Promise.reject(new Error(`Unable to upload ${stats.name}`))
        }

        const data = await response.json();

        console.log('### data', data)

        return Promise.resolve(data)
    })
}