import Sqids from "sqids";
import * as db from "@code-pennypost/database";

const sqids = new Sqids({
    alphabet: "0123456789",
    minLength: 3,
})

async function getSlugSeed() : Promise<number> {
    const count = await db.resultOrNull(db.post.getPostCount)();
    if (count == null) {
        throw new Error('Failed to get post count');
    }

    return count;
}


async function generateSlug(title: string): Promise<string> {
    // We need to make sure two posts with the same title don't have the same URL

    const seed = await getSlugSeed();
    const sqid = sqids.encode([...Buffer.from(String(seed))]);

    return sqid + '/' + title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

export {
    generateSlug,
}