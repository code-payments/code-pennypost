import * as proto from '@code-pennypost/api';
import * as api from '../../services';

const ErrFailedToGetPreviewContent = () => new Error('Failed to get preview content');
const ErrFailedToGetFullContent = () => new Error('Failed to get full content')
const ErrFailedToUpload = () => new Error('Failed to upload');

const uploadFile = async (file: Blob) => {
    const buf = await file.arrayBuffer();
    const req = new proto.DataUploadRequest({ file: {
            mimeType: file.type, 
            data: new Uint8Array(buf) 
        }
    });

    const res = await api.endpoints.data.upload(req);
    if (res.result != proto.DataUploadResponse_Result.OK) {
        throw ErrFailedToUpload();
    }

    return res;
}

const getPreviewContent = async (slug: string) => {
    const req = new proto.DataGetPreviewRequest({ slug });
    const res = await api.endpoints.data.getPreview(req);

    if (res.result != proto.DataGetPreviewResponse_Result.OK) {
        throw ErrFailedToGetPreviewContent();
    }

    if (!res.content) {
        throw ErrFailedToGetPreviewContent();
    }

    return res;
}

const getFullContent = async (slug: string) => {
    const req = new proto.DataGetFullRequest({ slug });
    const res = await api.endpoints.data.getFull(req);

    if (res.result != proto.DataGetFullResponse_Result.OK) {
        throw ErrFailedToGetFullContent();
    }

    if (!res.content) {
        throw ErrFailedToGetFullContent();
    }

    return res;
}

export {
    uploadFile,
    getPreviewContent,
    getFullContent,
}