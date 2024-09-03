import * as proto from "@code-pennypost/api";
import * as db from "@code-pennypost/database";
import * as code from '@code-wallet/client';
import { CurrencyCode } from "@code-wallet/library";

import { Request, Response } from "express";
import { useConfig } from '../../config';
import { useService } from "../../service";

const ErrDataNotFound = (res: Response) => res.error({ message: "Payment not found" }, 404);
const ErrInvalidRequest = (res: Response) => res.error({ message: "Invalid request" }, 400);
const ErrUnexpectedError = (res: Response) => res.error({ message: "Unexpected error" }, 500);


const create = async (req: Request, res: Response) => {
  const config = useConfig();
  const service = useService(proto.PaymentIntentService.methods.create);
  const { itemId } = service.decode(req.body);

  if (!itemId) {
    return ErrInvalidRequest(res);
  }

  const post = await db.resultOrNull(db.post.getPostById)(itemId);
  if (!post) {
    return ErrDataNotFound(res);
  }

  const price = parseFloat(post.price);
  if (isNaN(price)) {
    return ErrUnexpectedError(res);
  }

  const paymentAddress = post.paymentAddress;
  if (!paymentAddress) {
    return ErrUnexpectedError(res);
  }

  try {
    const { clientSecret, id } = await code.paymentIntents.create({
      mode: 'payment',
      amount: price,
      currency: config.storeCurrency as CurrencyCode,
      destination: paymentAddress,
      login: {
        domain: config.hostname,
        verifier: config.storeVerifier,
      },
      signers: [ config.getVerifierKeypair() ],
    });

    const status = db.intent.IntentStatus.PENDING;
    const paymentIntent = await db.resultOrNull(db.payment.createPaymentIntent)({
      id,
      status,
      clientSecret,
      itemId,
      destination: paymentAddress,
      price: post.price,
      currency: config.storeCurrency,
    });

    if (!paymentIntent) {
      return ErrUnexpectedError(res);
    }

    const body = service.encode(
      new proto.PaymentIntentCreateResponse({
        result: proto.PaymentIntentCreateResponse_Result.OK,
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