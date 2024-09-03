import * as proto from '@code-pennypost/api';
import * as api from '../../services';

const createPost = async (content: string) => {
    const req = new proto.PostCreateRequest({
        post: new proto.Post(), content,
    });

    const res = await api.endpoints.post.create(req);

    if (res.result !== proto.PostCreateResponse_Result.OK) {
        throw new Error('Post create request result was not OK');
    }

    if (!res.id) {
        throw new Error('Failed to get post id');
    }

    if (!res.slug) {
        throw new Error('Failed to get post slug');
    }

    return res;
}

const getPost = async (slug: string) => {
    const req = new proto.PostGetRequest({ slug });
    const res = await api.endpoints.post.get(req);

    if (res.result != proto.PostGetResponse_Result.OK) {
        throw new Error('Post get request result was not OK');
    }

    if (!res.post) {
        throw new Error('Failed to get post');
    }

    return res.post;
}

export {
    createPost,
    getPost,
}