import { Post } from "@code-pennypost/api";
import * as db from "@code-pennypost/database";
import { generatePreview, splitTitleFromContent } from "../utils/html";

const ErrPostNotFound = () => new Error('Post not found');
const ErrPostOwnerNotFound = () => new Error('Post owner not found');
const ErrPostContentNotFound = () => new Error('Post content not found');

async function getPostBySlug(slug: string) : Promise<Post> {
    const post = await db.resultOrNull(db.post.getPostBySlug)(slug);
    if (!post) {
        throw ErrPostNotFound();
    }

    return db.post.toProto(post);
}

async function getFullContentForPost(post: Post) {
    const data = await db.resultOrNull(db.data.getDataById)(post.contentId);
    if (!data) {
        throw ErrPostContentNotFound();
    }

    const content = Buffer.from(data.value).toString();
    return await splitTitleFromContent(content);
}

async function getPreviewForPost(post: Post) {
    const data = await db.resultOrNull(db.data.getDataById)(post.contentId);
    if (!data) {
        throw ErrPostContentNotFound();
    }

    const content = Buffer.from(data.value).toString();
    const { title, html } = await splitTitleFromContent(content);

    return {
        title,
        html: generatePreview(html),
    }
}

async function getOwnerProfileForPost(post: Post) {
    const user = await db.resultOrNull(db.user.getUserById)(post.ownerId);
    if (!user) {
        throw ErrPostOwnerNotFound();
    }

    return db.user.toProto(user);
}

export {
    getPostBySlug,
    getPreviewForPost,
    getFullContentForPost,
    getOwnerProfileForPost,
}