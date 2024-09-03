import * as proto from '@code-pennypost/api'
import { log } from './utils/logger';

const getDecoder = <T extends proto.MethodInfo>(method: T) => {
    return (data: Buffer) : InstanceType<T['I']> => {
        const body = method.I.fromBinary(data) as InstanceType<T['I']>;
        log.grpc_request(method.I.typeName, body);
        return body;
    }
}

const getEncoder = <T extends proto.MethodInfo>(method: T) => {
    return (data: InstanceType<T['O']>) : Buffer => {
        log.grpc_response(method.O.typeName, data);
        return Buffer.from(data.toBinary());
    }
}

const useService = <T extends proto.MethodInfo>(method: T) => {
    const decode = getDecoder(method);
    const encode = getEncoder(method);

    return { 
        decode,
        encode, 
        name: method.name
    };
}

export {
    useService,
    getDecoder,
    getEncoder
}