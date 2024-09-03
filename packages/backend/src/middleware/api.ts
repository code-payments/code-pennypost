import * as proto from '@code-pennypost/api'
import { NextFunction, Request, Response } from "express";
import { log } from '../utils/logger';

declare global {
  namespace Express {
    interface Response {
        success: (res: Partial<proto.Response>) => void;
        error: (res: Partial<proto.Response>, status: number) => void;
    }
  }
}

const wrap = (res: Partial<proto.Response>) => {
  const buf = Buffer.from(new proto.Response(res).toBinary());
  return buf;
}

const send = (body: Partial<proto.Response>, res: Response, status: number) => {
    res.header("Content-Type", "application/octet-stream");
    res.status(status);
    res.send(wrap(body));
};

const success = (res: Response) => {
  return (body: Partial<proto.Response>) => {
    body.result = proto.Response_Result.OK;
    send(body, res, 200);
  };
};

const error = (res: Response) => {
  return (body: Partial<proto.Response>, status: number) => {
    log.grpc_error(body);
    send(body, res, status);
  };
};

async function apiMiddleware(req: Request, res: Response, next: NextFunction) {
  res.success = success(res);
  res.error = error(res);

  next();
};

export {
    apiMiddleware,
}

