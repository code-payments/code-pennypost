import * as proto from "@code-pennypost/api";
import { getAuthToken, isLoggedIn, logout } from "../state/account";

const ErrNetworkError = () => new Error("Network error");
const ErrInvalidResponse = (status:number) => new Error(`Request failed with status code ${status}`);
const ErrUnauthorized = () => new Error(`Session expired`);

const getDecoder = <T extends proto.MethodInfo>(method: T) => {
    return (data: Uint8Array) : InstanceType<T['O']> => {
        return method.O.fromBinary(data) as InstanceType<T['O']>;
    }
}

const getEncoder = <T extends proto.MethodInfo>(_: T) => {
    return (data: InstanceType<T['I']>) : Uint8Array => {
        return data.toBinary();
    }
}

const getSender = <T extends proto.MethodInfo>(_: T) => {

    return (url: string, payload: any): Promise<proto.Response> => {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();

            req.open('POST', url, true);
            req.responseType = 'arraybuffer';
            req.setRequestHeader("Content-Type", "application/octet-stream");
            req.setRequestHeader("no-cors", "true");
            
            if (isLoggedIn()) {
                req.setRequestHeader("Authorization", `Bearer ${getAuthToken()}`);
            }
            
            req.onerror = () => { reject(ErrNetworkError()); };
            req.onload = () => {
                if (req.status === 401) {
                    logout();
                    reject(ErrUnauthorized());
                } else {
                    if (req.status >= 200 && req.status < 400) {
                        const envelope = proto.Response.fromBinary(new Uint8Array(req.response));
                        resolve(envelope);
                    } else {
                        reject(ErrInvalidResponse(req.status));
                    }
                }
            };

            req.send(payload);
        });
    }
}

const useService = <T extends proto.MethodInfo>(service: T) => {
    const decode = getDecoder(service);
    const encode = getEncoder(service);
    const send   = getSender(service);

    return { 
        decode,
        encode, 
        send
    };
}

const rpc = async <T extends proto.MethodInfo>(base:string, path: string, method: T, req: InstanceType<T['I']>) => {
  const service = useService(method);
  const payload = service.encode(req);
  const envelope = await service.send(base+path, payload);
  const res = service.decode(envelope.body);
  return res;
};

export {
    useService,
    rpc,
}