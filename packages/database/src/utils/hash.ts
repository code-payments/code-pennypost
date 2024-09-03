import crypto from 'crypto';

function hashBuffer(buffer: Buffer): Buffer {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest();
}

export {
  hashBuffer,
};