import * as db from "@code-pennypost/database";
import { DataFile } from "@code-pennypost/api";
import { canReduceImageSize, convertImageToWebP } from "../utils/image";

const ErrUnexpectedError = () => new Error('Unexpected error');
const ErrMimeTypeNotSupported = () => new Error('Mime type not supported');

const createImageData = async (file: DataFile, ownerId: string) => {

  // TODO: Find a better way to handle this
  // Handle some common mime type issues from mobile clients
  if (file.mimeType === 'public.png') {
    file.mimeType = 'image/png';
  }
  if (file.mimeType === 'public.jpeg') {
    file.mimeType = 'image/jpeg';
  }

  if (!file.mimeType.startsWith('image/')) {
    console.log('Mime type not supported:', file.mimeType);
    throw ErrMimeTypeNotSupported();
  }

  if (canReduceImageSize(file.mimeType)) {
    try {
      const data = await convertImageToWebP(file.data, file.mimeType);
      if (data.length < file.data.length) {
        file.mimeType = 'image/webp';
        file.data = data;
      }
    } catch (err) {
      console.error('Error converting image to webp', err);
      throw ErrUnexpectedError();
    }
  }

  const value = Buffer.from(file.toBinary());
  const result = await db.resultOrNull(db.data.createData)(ownerId, {
    key: 'file',
    value,
  });

  if (!result) {
    throw ErrUnexpectedError();
  }

  return result;
};

const getOrCreateImageIdFromUrl = async (url: string, ownerId: string) => {
  // The URL might be a local image URL, in which case we can extract the ID
  // from the URL itself. If it's an external URL, we need to fetch the image
  // and store it in the database.
  const match = url.match(/^\/content\/(.+)$/);
  if (match) {
    // The URL is a local image URL, just return the ID
    return match[1];
  } else {

    const imgReq = await fetch(url);
    const imgData = await imgReq.arrayBuffer();

    const mimeType = imgReq.headers.get('content-type');
    if (mimeType) {

      const file = new DataFile({
        data: new Uint8Array(imgData),
        mimeType,
      });

      const result = await createImageData(file, ownerId);
      if (!result) {
        throw ErrUnexpectedError();
      }

      return result.id;
    }
  }
}

export {
  createImageData,
  getOrCreateImageIdFromUrl,
}