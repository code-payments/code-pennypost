import sharp from "sharp";

const supported = [
  'image/jpeg', 
  'image/png', 
  'image/gif', 
  'image/tiff'
];

const ErrMimeTypeNotSupported = () => new Error('MIME type not supported');

function canReduceImageSize(mimeType: string): boolean {
  return supported.includes(mimeType);
}

async function convertImageToWebP(
  imageBuffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>,
  mimeType: string
): Promise<Buffer> {

  if (!canReduceImageSize(mimeType)) {
    throw ErrMimeTypeNotSupported();
  }

  const webpBuffer = await sharp(Buffer.from(imageBuffer))
    .webp({ quality: 80 })
    .toBuffer();

  return webpBuffer;
}

export {
  canReduceImageSize,
  convertImageToWebP
}