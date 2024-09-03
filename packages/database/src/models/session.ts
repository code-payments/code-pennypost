import { PrismaClient, Session } from "@prisma/client";
import { hashBuffer } from "../utils/hash";

const prisma = new PrismaClient();

interface CreateSessionOpts {
    intentId: string;
    userId: string;
    source: string;
    token: string;
    expiry: string;
    userAgent: string;
    ip: string;
}

async function createSession(opts: CreateSessionOpts): Promise<Session> {
    const buf = Buffer.from(opts.token);
    const hash = hashBuffer(buf).toString("base64");

    const record = await prisma.session.create({
        data: {
            userId: opts.userId,
            intentId: opts.intentId,
            userAgent: opts.userAgent,
            source: opts.source,
            expiry: opts.expiry,
            ip: opts.ip,
            hash,
        },
    });

    return record;
}


async function getSessionByIntentId(intentId: string, source: string): Promise<Session | null> {
    const record = await prisma.session.findUnique({
        where: {
            intentId_source: {
                intentId,
                source,
            }
        },
    });
    return record;
}


export {
    createSession,
    getSessionByIntentId
}
