import { jwtVerify, importJWK, JWTPayload, SignJWT } from 'jose';
import { Keypair, PublicKey } from "@code-wallet/library";

async function verifyToken(token: string, publicKey: PublicKey) {
  const publicKeyBase64Url = publicKey.toBuffer().toString('base64url');

  const jwk = {
    kty: 'OKP',
    crv: 'Ed25519',
    alg: 'EdDSA',
    x: publicKeyBase64Url,
  };

  // Import the JWK to a format that the 'jose' library can use
  const importedKey = await importJWK(jwk, 'EdDSA');

  return await jwtVerify(token, importedKey, { algorithms: ['EdDSA'] });
}

async function createToken(payload: JWTPayload, signer: Keypair, expiresIn: string = '1d') {
  const pubkey = Buffer.from(signer.getPublicValue());
  const secretKey = Buffer.from(signer.getPrivateValue());

  const jwk = {
    kty: 'OKP',
    crv: 'Ed25519',
    alg: 'EdDSA',
    use: 'sig',
    x: pubkey.toString('base64url'),
    d: secretKey.toString('base64url'),
  }

  const importedKey = await importJWK(jwk, 'EdDSA');

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'EdDSA' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(importedKey);

  return token;
}

export {
    verifyToken,
    createToken,
}