import * as proto from '@code-pennypost/api';
import * as api from '../../services';

const createLoginIntent = async (nonce: string) => {
    const res = await api.endpoints.login.create(
        new proto.LoginIntentCreateRequest({ nonce })
    );

    if (res.result !== proto.LoginIntentCreateResponse_Result.OK) {
        throw new Error('Failed to create login intent');
    }

    if (!res.clientSecret) {
        throw new Error('Failed to get intent id');
    }

    return res;
}

export {
    createLoginIntent,
}
