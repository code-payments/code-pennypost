import { PrismaClient, TipIntent } from "@prisma/client";
import * as proto from "@code-pennypost/api";
import { createIntent } from "./intent";

const prisma = new PrismaClient();

const toProto = (data: TipIntent) : proto.TipIntent => {
    return new proto.TipIntent({
        intentId: data.intentId,
        itemId: data.itemId,
        destination: data.destination,
        amount: data.amount,
        currency: data.currency,
    });
};

interface CreateTipIntentOpts {
    id: string;
    status: string;
    itemId: string;
    destination: string;
    amount: string;
    currency: string;
    clientSecret: string;
}

async function createTipIntent(opts: CreateTipIntentOpts): Promise<TipIntent> {
    const intent = await createIntent({
        id: opts.id,
        status: opts.status,
        clientSecret: opts.clientSecret,
    });

    if (!intent) {
        throw new Error('Failed to create intent');
    }

    const record = await prisma.tipIntent.create({
        data: {
            intentId: opts.id,
            itemId: opts.itemId,
            destination: opts.destination,
            amount: opts.amount,
            currency: opts.currency,
        },
    });

    return record;
}

async function getTipIntentById(tipIntentId: string): Promise<TipIntent | null> {
    const record = await prisma.tipIntent.findUnique({
        where: {
            intentId: tipIntentId,
        },
    });
    return record;
}


export {
    toProto,

    createTipIntent,
    getTipIntentById,
}