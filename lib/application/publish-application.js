import os from 'os'
import path from 'path'
import fs from 'fs'
import tar from 'tar'
import fetch from 'node-fetch'
import FormData from 'form-data'
import { hashElement } from 'folder-hash'

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

    await tar.c(
        {
            gzip: true,
            file: file
        },
        [appToCompress]
    )

    const form = new FormData();
    const stats = fs.statSync(file);
    const fileSizeInBytes = stats.size;
    const fileStream = fs.createReadStream(file);

    const { hash } = await hashElement(appToCompress, {
        algo: 'sha1',
        encoding: 'hex'
    })

    form.append('code', applicationInfo.name);
    form.append('version', applicationInfo.version);
    form.append('hash', hash);
    form.append('file', fileStream, { knownLength: fileSizeInBytes });

    const response = await fetch(
        'http://localhost:3100/api/apps/upload',
        {
            method: 'POST',
            body: form
        }
    );

    if (!response.ok) {
        return Promise.reject(response.body)
    }

    return Promise.resolve(await response.json())
}