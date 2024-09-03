import * as proto from "@code-pennypost/api";
import * as db from "@code-pennypost/database";

import { Request, Response } from "express";
import { useService } from "../../service";
import { useConfig } from "../../config";
import { createToken } from "../../utils/jwt";
import { getAndUpdateIntent } from "../../models/intent";

const ErrUserNotFound = (res: Response) => res.error({ message: "User not found" }, 404);
const ErrInvalidRequest = (res: Response) => res.error({ message: "Invalid request" }, 400);
const ErrIntentAlreadyUsed = (res: Response) => res.error({ message: "Intent already used for login" }, 400);
const ErrNoRelatedUser = (res: Response) => res.error({ message: "No related user provided" }, 400);
const ErrUnexpectedError = (res: Response) => res.error({ message: "Unexpected error" }, 500);

const defaultExpiration = '30d';

const session = async (req: Request, res: Response) => {
    const config = useConfig();
    const service = useService(proto.UserService.methods.session);

    const { intentId, source } = service.decode(req.body);
    if (!intentId) {
        return ErrInvalidRequest(res);
    }

    if (source !== 'direct' && source !== 'redirect') {
        return ErrInvalidRequest(res);
    }

    try {
        const intent = await getAndUpdateIntent(intentId);

        if (intent.status !== db.intent.IntentStatus.COMPLETED) {
            return ErrInvalidRequest(res); // Intent not completed yet
        }

        if (!intent.relatedUser) {
            return ErrNoRelatedUser(res); // App did not provide a user
        }

        // Check if the intent has already been used to create a session (with the same source)
        const existingSession = await db.resultOrNull(db.session.getSessionByIntentId)(intentId, source);
        if (existingSession) {
            return ErrIntentAlreadyUsed(res);
        }

        // Get or create the user
        const user = await db.resultOrNull(db.user.getOrCreateUser)({ codeAddress: intent.relatedUser });
        if (!user) {
            return ErrUnexpectedError(res);
        }

        // Create an auth token for the user that expires in 1 hour
        const expiry = defaultExpiration;
        const token = await createToken({ 
            id: user.id, 
            verifier: config.storeVerifier, 
            domain: config.hostname 
        }, config.getVerifierKeypair(), expiry);

        // Create a session record
        const userAgent = req.headers['user-agent'] as string ?? 'unknown';
        const ip = req.headers['x-forwarded-for'] as string ?? req.connection.remoteAddress ?? 'unknown';
        const session = await db.resultOrNull(db.session.createSession)({
            userId: user.id,
            intentId,
            source,
            token,
            expiry,
            userAgent,
            ip,
        }); 
        if (!session) {
            return ErrUnexpectedError(res);
        }

        const body = service.encode(
            new proto.UserSessionResponse({
                result: proto.UserSessionResponse_Result.OK,
                token,
            })
        );

        res.success({ body });
    } catch (err) {
        console.error(err);
        return ErrUnexpectedError(res);
    }
}

const get = async (req: Request, res: Response) => {
    const service = useService(proto.UserService.methods.get);

    if (!req.user || !req.user.id) {
        return ErrUnexpectedError(res);
    }

    const userId = req.user.id;

    try {
        const user = await db.resultOrNull(db.user.getUserById)(userId);
        if (!user) {
            return ErrUserNotFound(res);
        }

        const body = service.encode(
            new proto.UserGetResponse({
                result: proto.UserGetResponse_Result.OK,
                user: db.user.toProto(user),
            })
        );

        res.success({ body });
    } catch (err) {
        console.error(err);
        return ErrUnexpectedError(res);
    }
}

const getPublicProfile = async (req: Request, res: Response) => {
    const service = useService(proto.UserService.methods.getPublicProfile);
    const {userId} = service.decode(req.body);

    if (!userId) {
        return ErrInvalidRequest(res);
    }

    try {
        const user = await db.resultOrNull(db.user.getUserById)(userId);
        if (!user) {
            return ErrUserNotFound(res);
        }

        const body = service.encode(
            new proto.UserGetPublicProfileResponse({
                result: proto.UserGetPublicProfileResponse_Result.OK,

                // Be careful not to leak sensitive information, none at the moment
                user: db.user.toProto(user),
            })
        );

        res.success({ body });
    } catch (err) {
        console.error(err);
        return ErrUnexpectedError(res);
    }
}

const update = async (req: Request, res: Response) => {
    const service = useService(proto.UserService.methods.update);
    const { name, bio, avatar } = service.decode(req.body);

    if (!req.user || !req.user.id) {
        return ErrUnexpectedError(res);
    }

    if (!name && !bio && !avatar) {
        return ErrInvalidRequest(res);
    }

    const userId = req.user.id;

    try {
        const updatedUser = await db.resultOrNull(db.user.update)(userId, {
            name,
            bio,
            avatar: avatar ? Buffer.from(avatar) : undefined,
        });

        if (!updatedUser) {
            return ErrUserNotFound(res);
        }

        const body = service.encode(
            new proto.UserUpdateResponse({
                result: proto.UserUpdateResponse_Result.OK,
            })
        );

        res.success({ body });
    } catch (err) {
        console.error(err);
        return ErrUnexpectedError(res);
    }
}

export {
    get,
    getPublicProfile,
    session,
    update,
}