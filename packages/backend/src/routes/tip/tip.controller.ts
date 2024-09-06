import * as proto from "@code-pennypost/api";
import * as db from "@code-pennypost/database";
import * as code from '@code-wallet/client';
import { CurrencyCode } from "@code-wallet/library";

import { Request, Response } from "express";
import { useConfig } from '../../config';
import { useService } from "../../service";

const ErrDataNotFound = (res: Response) => res.error({ message: "Tip not found" }, 404);
const ErrInvalidRequest = (res: Response) => res.error({ message: "Invalid request" }, 400);
const ErrUnexpectedError = (res: Response) => res.error({ message: "Unexpected error" }, 500);

const create = async (req: Request, res: Response) => {
  const config = useConfig();
  const service = useService(proto.TipIntentService.methods.create);
  const { itemId, amount } = service.decode(req.body);

  if (!itemId) {
    return ErrInvalidRequest(res);
  }

  const post = await db.resultOrNull(db.post.getPostById)(itemId);
  if (!post) {
    return ErrDataNotFound(res);
  }

  const tipAmount = parseFloat(amount);
  if (isNaN(tipAmount) || tipAmount <= 0) {
    return ErrInvalidRequest(res);
  }

  const tipAddress = post.paymentAddress;
  if (!tipAddress) {
    return ErrUnexpectedError(res);
  }

  try {

    // Technically, this is a payment, not a tip (Code tips are to tipcards
    // which are bound to a twitter handle. This payment address is bound to a
    // verifier id, so we need to sign the payment with the verifier keypair)

    const { clientSecret, id } = await code.paymentIntents.create({
      mode: 'payment',
      amount: tipAmount,
      currency: config.storeCurrency as CurrencyCode,
      destination: tipAddress,
      login: {
        domain: config.hostname,
        verifier: config.storeVerifier,
      },
      signers: [ config.getVerifierKeypair() ],
    });

    const status = db.intent.IntentStatus.PENDING;
    const TipIntent = await db.resultOrNull(db.tip.createTipIntent)({
      id,
      status,
      clientSecret,
      itemId,
      amount,
      destination: tipAddress,
      currency: config.storeCurrency,
    });

    if (!TipIntent) {
      return ErrUnexpectedError(res);
    }

    const body = service.encode(
      new proto.TipIntentCreateResponse({
        result: proto.TipIntentCreateResponse_Result.OK,
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