import { ref }  from 'vue';
import { PublicKey } from '@code-wallet/library';
import * as proto from '@code-pennypost/api';
import * as api from '../services';
import { getUserInfo } from '../services/helpers/user';

export interface UserSession {
    id: string;
    codeAddress: PublicKey;

    name: string | undefined;
    bio: string | undefined;
    avatar: Uint8Array | undefined;
}

const key = 'pennypost:token';
const account = ref<UserSession | undefined>();

const getAuthToken = () : string | null => {
    if (import.meta.env.SSR) {
        return null;
    }

    return localStorage.getItem(key);
}

const setAuthToken = (val: string) => {
    localStorage.setItem(key, val);
}

const createSessionObject = (info: proto.User) => {
    return {
        id: info.id,
        codeAddress: PublicKey.fromBase58(info.codeAddress),
        name: info.name,
        bio: info.bio,
        avatar: info.avatar,
    };
}

const login = async (intentId: string, source: 'direct' | 'redirect') => {
    if (!intentId) {
        throw new Error('Invalid intent id');
    }

    if (source !== 'direct' && source !== 'redirect') {
        throw new Error('Invalid login source');
    }

    const req = new proto.UserSessionRequest({ intentId, source })
    const res = await api.endpoints.user.session(req);

    if (!res) {
        throw new Error('Unexpected login response error');
    }

    if (res.result !== proto.UserSessionResponse_Result.OK) {
        throw new Error(`Failed to login: ${res.result}`);
    }

    if (!res.token) {
        throw new Error('No auth token in login response');
    }

    setAuthToken(res.token);
    account.value = createSessionObject(await getUserInfo());

    return account.value;
}


const logout = () => {
    localStorage.removeItem(key);
    account.value = undefined;
    window.location.reload();
}

const isLoggedIn = () => {
    return getAuthToken() !== null;
}

const useAccount = async () => {
    if (!account.value && isLoggedIn()) {
        try {
            const user = await getUserInfo();
            account.value = createSessionObject(user);
        } catch (err) {
            console.warn('Failed to get user info', err);
            logout();
        }
    }

    return account;
}

export {
    login,
    logout,
    isLoggedIn,

    getAuthToken,
    setAuthToken,

    useAccount,
}