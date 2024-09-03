import { PrismaClient, LoginIntent } from "@prisma/client";
import * as proto from "@code-pennypost/api";
import { createIntent } from "./intent";

const prisma = new PrismaClient();

const toProto = (data: LoginIntent) : proto.LoginIntent => {
    return new proto.LoginIntent({
        intentId: data.intentId,
    });
}

interface CreateLoginIntentOpts {
    id: string;
    status: string;
    clientSecret: string;
}

async function createLoginIntent(opts: CreateLoginIntentOpts): Promise<LoginIntent> {
    const intent = await createIntent({
        id: opts.id,
        status: opts.status,
        clientSecret: opts.clientSecret,
    });

    if (!intent) {
        throw new Error('Failed to create intent');
    }

    const record = await prisma.loginIntent.create({
        data: {
            intentId: opts.id,
        },
    });

    return record;
}

async function getLoginIntentById(loginIntentId: string): Promise<LoginIntent | null> {
    const record = await prisma.loginIntent.findUnique({
        where: {
            intentId: loginIntentId,
        },
    });
    return record;
}

export {
    toProto,

    createLoginIntent,
    getLoginIntentById,
}