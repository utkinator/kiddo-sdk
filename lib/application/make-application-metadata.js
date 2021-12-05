import {
    makeCommonMetadata
} from '../../utils/make-common-metadata.js'

export const makeApplicationMetadata = (appInfo, opts) => {
    const {
        name,
        version,
        rootElelementId,
        runtimeContextKey,
    } = appInfo;

    return {
        ...makeCommonMetadata(),
        application: {
            name,
            version
        },
        rootElelementId,
        runtimeContextKey,
    }
}