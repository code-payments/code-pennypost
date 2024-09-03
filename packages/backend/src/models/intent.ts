import * as db from "@code-pennypost/database";
import * as code from '@code-wallet/client';
import { useConfig } from "../config";

const ErrIntentNotFound = () => new Error('Intent not found');
const ErrFailedToUpdateIntent = () => new Error('Failed to update intent');

async function getAndUpdateIntent(id: string) {
    const config = useConfig();

    const intent = await db.resultOrNull(db.intent.getIntentById)(id);
    if (!intent) {
        throw ErrIntentNotFound();
    }

    if (intent.status === db.intent.IntentStatus.COMPLETED &&
        intent.relatedUser) {
        return intent;
    }

    const statusQuery = await code.getStatus({ intent: id });
    if (statusQuery.status !== 'confirmed') {
        return intent;
    }

    const userQuery = await code.getUserId({ 
        intent: id, 
        verifier: config.getVerifierKeypair()
    });

    if (!userQuery.userId) {
        console.warn(`Failed to get user id for completed intent ${id}, this is unexpected.`);
    }

    const updated = await db.resultOrNull(db.intent.updateIntent)(intent.id, { 
        status: db.intent.IntentStatus.COMPLETED,
        relatedUser: userQuery.userId,
    });

    if (!updated) {
        throw ErrFailedToUpdateIntent();
    }

    return updated;
}

export {
    getAndUpdateIntent,
}