import * as proto from "@code-pennypost/api";
import * as db from "@code-pennypost/database";
import * as code from '@code-wallet/client';

import { Request, Response } from "express";
import { useConfig } from '../../config';
import { useService } from "../../service";

const ErrInvalidRequest = (res: Response) => res.error({ message: "Invalid request" }, 400);
const ErrUnexpectedError = (res: Response) => res.error({ message: "Unexpected error" }, 500);

const create = async (req: Request, res: Response) => {
  const config = useConfig();
  const service = useService(proto.LoginIntentService.methods.create);

  const { nonce } = service.decode(req.body);
  if (!nonce) {
    return ErrInvalidRequest(res);
  }

  // Ensure that no one can guess the idempotency key we're about to generate
  const now = Date.now();
  const idempotencyVal = `pennypost-${now}-${nonce}`;
  const idempotencyKey = config.getVerifierKeypair().sign(Buffer.from(idempotencyVal));

  try {

    // Create login intent (submit it to the Code Sequencer)
    const { clientSecret, id } = await code.loginIntents.create({
      mode: 'login',
      login: {
        domain: config.hostname,
        verifier: config.storeVerifier,
      },
      signers: [ config.getVerifierKeypair() ],
      idempotencyKey: Buffer.from(idempotencyKey).toString('base64'),
    });

    // Save login intent to our database
    const loginIntent = await db.resultOrNull(db.login.createLoginIntent)({
      id,
      clientSecret,
      status: db.intent.IntentStatus.PENDING,
    });

    if (!loginIntent) {
      return ErrUnexpectedError(res);
    }

    const body = service.encode(
      new proto.LoginIntentCreateResponse({
        result: proto.LoginIntentCreateResponse_Result.OK,
        clientSecret,
      })
    );

    res.success({ body });

  } catch (err) {
    console.error(err);
    return ErrUnexpectedError(res);
  }
}


export {
    create,
}