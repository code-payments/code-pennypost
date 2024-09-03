import { PrismaClient, PaymentIntent } from "@prisma/client";
import * as proto from "@code-pennypost/api";
import { createIntent } from "./intent";

const prisma = new PrismaClient();

const toProto = (data: PaymentIntent) : proto.PaymentIntent => {
    return new proto.PaymentIntent({
        intentId: data.intentId,
        itemId: data.itemId,
        destination: data.destination,
        price: data.price,
        currency: data.currency,
    });
};

interface CreatePaymentIntentOpts {
    id: string;
    status: string;
    itemId: string;
    destination: string;
    price: string;
    currency: string;
    clientSecret: string;
}

async function createPaymentIntent(opts: CreatePaymentIntentOpts): Promise<PaymentIntent> {
    const intent = await createIntent({
        id: opts.id,
        status: opts.status,
        clientSecret: opts.clientSecret,
    });

    if (!intent) {
        throw new Error('Failed to create intent');
    }

    const record = await prisma.paymentIntent.create({
        data: {
            intentId: opts.id,
            itemId: opts.itemId,
            destination: opts.destination,
            price: opts.price,
            currency: opts.currency,
        },
    });

    return record;
}

async function getPaymentIntentById(paymentIntentId: string): Promise<PaymentIntent | null> {
    const record = await prisma.paymentIntent.findUnique({
        where: {
            intentId: paymentIntentId,
        },
    });
    return record;
}

interface GetPaymentIntentForItemAndOwnerOpts {
    itemId: string;
    codeAddress: string;
}

async function getPaymentIntentsForItemAndOwner(opts: GetPaymentIntentForItemAndOwnerOpts): Promise<PaymentIntent[]> {
    const record = await prisma.paymentIntent.findMany({
        take: 5, // Prevents abuse
        where: {
            itemId: opts.itemId,
            intent: {
                relatedUser: opts.codeAddress,
            },
        },
        orderBy: {
            intent: {
                // Put completed intents first
                status: 'asc'
            }
        }
    });

    return record;
}

export {
    toProto,

    createPaymentIntent,
    getPaymentIntentById,

    getPaymentIntentsForItemAndOwner,
}