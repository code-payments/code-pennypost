import { PrismaClient, User } from "@prisma/client";
import * as proto from "@code-pennypost/api";

const prisma = new PrismaClient();

const toProto = (data: User) : proto.User => {
    return new proto.User({
        id: data.id,
        codeAddress: data.codeAddress,

        name: data.name ?? undefined,
        bio: data.bio ?? undefined,
        avatar: data.avatar ?? undefined,
    });
}

interface GetOrCreateUserOpts {
    codeAddress: string;
}

async function getOrCreateUser(opts: GetOrCreateUserOpts): Promise<User> {
    const record = await prisma.user.upsert({
        where: {
            codeAddress: opts.codeAddress,
        },
        create: {
            codeAddress: opts.codeAddress,
        },
        update: {},
    });
    return record;
}

async function getUserById(userId: string): Promise<User | null> {
    const record = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    return record;
}

interface UpdateUserOpts {
    name?: string;
    bio?: string;
    avatar?: Buffer;
}

async function update(id: string, opts: UpdateUserOpts): Promise<User> {
    const record = await prisma.user.update({
        where: {
            id,
        },
        data: {
            name: opts.name,
            bio: opts.bio,
            avatar: opts.avatar,
        },
    });
    return record;
}

export {
    toProto,

    getOrCreateUser,
    getUserById,

    update,
}
