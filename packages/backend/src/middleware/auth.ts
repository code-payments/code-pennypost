import { PublicKey } from '@code-wallet/library';
import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from 'jose';
import { verifyToken } from '../utils/jwt';
import { useConfig } from '../config';

const ErrUnauthorized = (res : Response) => res.error({ message: "Unauthorized" }, 401);
const ErrMissingPayload = (res : Response) => res.error({ message: "Missing payload" }, 401);
const ErrInvalidSignature = (res : Response) => res.error({ message: "Invalid signature" }, 401);

interface UserSession extends JWTPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserSession;
    }
  }
}

async function requireLogin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return ErrUnauthorized(res);
  }

  const publicKey = PublicKey.fromBase58(useConfig().storeVerifier);
  const token = authHeader.split(' ')[1];

  try {
    const { payload } = await verifyToken(token, publicKey);
    if (!payload) {
        return ErrMissingPayload(res);
    }
    req.user = payload as UserSession;
  } catch (err) {
    return ErrInvalidSignature(res);
  }

  next();
}

export { requireLogin };