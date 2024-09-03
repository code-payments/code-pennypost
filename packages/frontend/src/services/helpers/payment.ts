import * as proto from '@code-pennypost/api';
import * as api from '../../services';

const getPaymentIntentId = async (id: string) => {
    const req = new proto.PaymentIntentCreateRequest({
        itemId: id,
    });

    const res = await api.endpoints.payment.create(req);

    if (res.result != proto.PaymentIntentCreateResponse_Result.OK) {
        throw new Error('Failed to create payment intent');
    }

    if (!res.clientSecret) {
        throw new Error('Failed to get payment intent id');
    }

    return res;
}

export {
    getPaymentIntentId,
}