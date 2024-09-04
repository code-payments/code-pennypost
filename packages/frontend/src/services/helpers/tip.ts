import * as proto from '@code-pennypost/api';
import * as api from '../../services';

const getTipIntentId = async (id: string, amount: string) => {
    const req = new proto.TipIntentCreateRequest({
        itemId: id,
        amount,
    });

    const res = await api.endpoints.tip.create(req);

    if (res.result != proto.TipIntentCreateResponse_Result.OK) {
        throw new Error('Failed to create payment intent');
    }

    if (!res.clientSecret) {
        throw new Error('Failed to get payment intent id');
    }

    return res;
}

export {
    getTipIntentId,
}