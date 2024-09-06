import * as proto from "@code-pennypost/api";
import * as db from "@code-pennypost/database";

import { Request, Response } from "express";
import { useService } from "../../service";
import { createImageData } from "../../models/data";
import { getAndUpdateIntent } from "../../models/intent";
import { getContentForPost } from "../../models/post";

const ErrPostNotFound = (res: Response) => res.error({ message: "Post not found" }, 404);
const ErrDataNotFound = (res: Response) => res.error({ message: "Data not found" }, 404);
const ErrPaymentNotFound = (res: Response) => res.error({ message: "Payment not found" }, 404);
const ErrInvalidRequest = (res: Response) => res.error({ message: "Invalid request" }, 400);
const ErrPaymentNotCompleted = (res: Response) => res.error({ message: "Payment not completed" }, 400);
const ErrUnexpectedError = (res: Response) => res.error({ message: "Unexpected error" }, 500);

const upload = async (req: Request, res: Response) => {
  const service = useService(proto.DataService.methods.upload);
  const { file } = service.decode(req.body);

  if (!file) {
    return ErrInvalidRequest(res);
  }

  if (!req.user || !req.user.id) {
    return ErrUnexpectedError(res);
  }

  try {
    const result = await createImageData(file, req.user.id);

    const body = service.encode(
      new proto.DataUploadResponse({
          result: proto.DataUploadResponse_Result.OK,
          id: result.id,
      })
    );

    res.success({ body });

  } catch (err) {
    console.error(err);
    return ErrUnexpectedError(res);
  }
};

const getPreview = async (req: Request, res: Response) => {
  const service = useService(proto.DataService.methods.getPreviewPost);
  const { id, slug } = service.decode(req.body);

  if (!id && !slug) {
    return ErrInvalidRequest(res);
  }

  try {
    const getPostBy = id ? db.post.getPostById : db.post.getPostBySlug;
    const post = await db.resultOrNull(getPostBy)(id || slug);
    if (!post) {
      return ErrPostNotFound(res);
    }

    const data = await db.resultOrNull(db.data.getDataById)(post.contentId);
    if (!data) {
      return ErrDataNotFound(res);
    }

    const { html } = await getContentForPost(db.post.toProto(post));

    const body = service.encode(
      new proto.DataGetPreviewResponse({
          result: proto.DataGetPreviewResponse_Result.OK,
          content: html,
      })
    );

    res.success({ body });

  } catch (err) {
    console.error(err);
    return ErrUnexpectedError(res);
  }
};

const getFull = async (req: Request, res: Response) => {
  const service = useService(proto.DataService.methods.getFullPost);
  const { id, slug } = service.decode(req.body);

  if (!id && !slug) {
    return ErrInvalidRequest(res);
  }

  if (!req.user || !req.user.id) {
    return ErrUnexpectedError(res);
  }

  const purchaserId = req.user.id;

  try {
    const getPostBy = id ? db.post.getPostById : db.post.getPostBySlug;
    const post = await db.resultOrNull(getPostBy)(id || slug);
    if (!post) {
      return ErrPostNotFound(res);
    }

    // Check if the post has a paywall, and if so, check if the user has paid
    if (post.hasPaywall) {
      const user = await db.resultOrNull(db.user.getUserById)(purchaserId);
      if (!user) {
        return ErrUnexpectedError(res);
      }

      // Check if the user is the owner of the post
      if (purchaserId != post.ownerId) {

        // TODO: Need a better approach to this. Fetching all intents is not ideal
        const payments = await db.resultOrNull(db.payment.getPaymentIntentsForItemAndOwner)({
          itemId: post.id,
          codeAddress: user.codeAddress,
        });

        if (!payments || payments.length === 0) {
          return ErrPaymentNotFound(res);
        }

        // Check if any of the intents are completed
        let found = false;
        for (const payment of payments) {
          const intent = await getAndUpdateIntent(payment.intentId);
          if (intent.status === db.intent.IntentStatus.COMPLETED) {
            found = true;
            break;
          }
        }
        if (!found) {
          return ErrPaymentNotCompleted(res);
        }
      }
    }
    
    const hasPaid = true; // otherwise we would have returned earlier
    const { html } = await getContentForPost(db.post.toProto(post), hasPaid);
    const body = service.encode(
      new proto.DataGetFullResponse({
          result: proto.DataGetFullResponse_Result.OK,
          content: html,
      })
    );

    res.success({ body });

  } catch (err) {
    console.error(err);
    return ErrUnexpectedError(res);
  }
};

export {
    upload,
    getPreview,
    getFull,
}