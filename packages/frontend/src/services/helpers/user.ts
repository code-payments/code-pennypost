import * as proto from '@code-pennypost/api';
import * as api from '../../services';

const getUserInfo = async () => {
    const req = new proto.UserGetRequest();
    const res = await api.endpoints.user.get(req);

    if (!res) {
        throw new Error('Unexpected user info response error');
    }

    if (res.result !== proto.UserGetResponse_Result.OK) {
        throw new Error(`Failed to get user info: ${res.result}`);
    }

    if (!res.user) {
        throw new Error('No user in response');
    }

    return res.user;
}

const getPublicProfile = async (userId: string) => {
    const req = new proto.UserGetPublicProfileRequest({ userId });
    const res = await api.endpoints.user.profile(req);

    if (!res) {
        throw new Error('Unexpected user info response error');
    }

    if (res.result !== proto.UserGetPublicProfileResponse_Result.OK) {
        throw new Error(`Failed to get user info: ${res.result}`);
    }

    if (!res.user) {
        throw new Error('No user in response');
    }

    return res.user;
}

const updateUser = async (opt: Partial<proto.UserUpdateRequest>) => {
    const res = await api.endpoints.user.update(
        new proto.UserUpdateRequest({ 
            name: opt.name,
            bio: opt.bio,
            avatar: opt.avatar,
         })
    );

    if (res.result !== proto.UserUpdateResponse_Result.OK) {
        throw new Error('Failed to update user');
    }

    return res;
}

export {
    getUserInfo,
    getPublicProfile,
    updateUser,
}
