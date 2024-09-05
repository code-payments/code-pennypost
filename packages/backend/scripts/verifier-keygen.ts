import { Keypair } from '@code-wallet/library';

const keypair = Keypair.generate();
const secret = keypair.getPrivateValue();

console.log(`
  This codebase ships with the "example-getcode.com" verifier key. 
  
  You should replace the example key with your own key once you have a domain
  name and have the ability to host a json file at 
  "https://<YOUR_DOMAIN_NAME>/.well-known/code-payments.json". 
  
  This codebase will automatically do this for you once you set the
  STORE_VERIFIER_SECRET environment variable. Set the STORE_VERIFIER_SECRET
  environment variable to the following value.  Keep this value secret and safe,
  do not share it anywhere.

  == "~/pennypost/backend/.env" ========================================================

  STORE_VERIFIER_SECRET=${Buffer.from(secret).toString('hex')}

  ======================================================================================

  Once you have set the STORE_VERIFIER_SECRET environment variable, you should
  see the public key value at the following URL.

  Expected public key: ${keypair.getPublicKey()}

  https://<YOUR_DOMAIN_NAME>/.well-known/code-payments.json
`);

