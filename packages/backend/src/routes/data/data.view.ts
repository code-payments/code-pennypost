import * as proto from "@code-pennypost/api";
import * as db from "@code-pennypost/database";

import { Request, Response } from "express";

const ErrDataNotFound = (res: Response) => res.error({ message: "Data not found" }, 404);
const ErrInvalidRequest = (res: Response) => res.error({ message: "Invalid request" }, 400);
const ErrUnexpectedError = (res: Response) => res.error({ message: "Unexpected error" }, 500);

const renderFile = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return ErrInvalidRequest(res);
  }

  try {
    const data = await db.resultOrNull(db.data.getDataById)(id);
    if (!data) {
      return ErrDataNotFound(res);
    }

    const file = proto.DataFile.fromBinary(data.value);

    res.setHeader("Content-Type", file.mimeType);
    res.send(file.data);
  } catch (err) {
    console.error(err);
    return ErrUnexpectedError(res);
  }
}

export {
  renderFile,
}