import { PrismaClient, Intent } from "@prisma/client";
import * as proto from "@code-pennypost/api";

const prisma = new PrismaClient();

export enum IntentStatus {
    PENDING = 'pending',
    COMPLETED = 'confirmed',
}

const isValidIntentStatus = (status: string): boolean => {
    return Object.values(IntentStatus).includes(status as IntentStatus);
}

const toProto = (data: Intent) : proto.Intent => {
    if (!isValidIntentStatus(data.status)) {
        throw new Error(`Invalid payment intent status: ${data.status}`);
    }

    return new proto.Intent({
        id: data.id,
        status: data.status,
        clientSecret: data.clientSecret,
        relatedUser: data.relatedUser ?? undefined,
    });
}

interface CreateIntentOpts {
    id: string;
    status: string;
    clientSecret: string;
}

async function createIntent(opts: CreateIntentOpts): Promise<Intent> {
    if (!isValidIntentStatus(opts.status)) {
        throw new Error(`Invalid payment intent status: ${opts.status}`);
    }

    const record = await prisma.intent.create({
        data: {
            id: opts.id,
            status: opts.status,
            clientSecret: opts.clientSecret,
        },
    });

    return record;
}

async function getIntentById(intentId: string): Promise<Intent | null> {
    const record = await prisma.intent.findUnique({
        where: {
            id: intentId,
        },
    });
    return record;
}

interface UpdateIntentOpts {
    status?: string;
    relatedUser?: string;
}

async function updateIntent(intentId: string, opts: UpdateIntentOpts): Promise<Intent | null> {
    if (opts.status && !isValidIntentStatus(opts.status)) {
        throw new Error(`Invalid intent status: ${opts.status}`);
    }

    const record = await prisma.intent.update({
        where: {
            id: intentId,
        },
        data: {
            status: opts.status,
            relatedUser: opts.relatedUser,
        },
    });

    return record;
}

export {
    toProto,

    createIntent,
    getIntentById,
    updateIntent,
}