import { PrismaClient, Data } from "@prisma/client";
import { hashBuffer } from "../utils/hash"
import * as proto from "@code-pennypost/api";

const prisma = new PrismaClient();

const toProto = (data: Data) : proto.Data => {
    return new proto.Data({
        id: data.id,
        ownerId: data.ownerId,
        hash: data.hash,
        value: data.value,
        key: data.key,
    });
};

interface CreateDataOpts {
  key: string;
  value: Buffer;
}

async function createData(ownerId:string, opts: CreateDataOpts): Promise<Data> {
  // In a real-world scenario, we would hash the data and store only the hash
  // in the database. The file would be stored in a separate storage service like
  // S3. For the sake of simplicity, we'll store the file in the database.

  // Override this function to store the file in a separate storage service like
  // S3. Then store the hash and url in the database.

  const hash = hashBuffer(opts.value).toString("base64");
  const record = await prisma.data.create({
    data: {
      ownerId,
      hash,
      key: opts.key,
      value: opts.value,
    },
  });

  return record;
}

async function getDataById(dataId: string): Promise<Data | null> {
  const record = await prisma.data.findUnique({
    where: {
      id: dataId,
    },
  });
  return record;
}

interface UpdateTemplateOpts {
  data: Buffer;
  hash: string;
  signature: string;
}

async function updateData(dataId: string, opts: UpdateTemplateOpts): Promise<Data | null> {
  const record = await prisma.data.update({
    where: {
      id: dataId,
    },
    data: {
      value: opts.data,
      hash: opts.hash,
    },
  });
  return record;
}

async function deleteData(dataId: string): Promise<boolean> {
  const record = await prisma.data.delete({
    where: {
      id: dataId,
    },
  });
  return !!record;
}

async function getLatestHash(ownerId: string, key: string): Promise<Partial<Data> | null> {
  const record = await prisma.data.findFirst({
    where: {
      ownerId,
      key,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      hash: true,
      createdAt: true,
    },
  });
  return record;
}

async function getLatest(ownerId: string, key: string): Promise<Data | null> {
  const record = await prisma.data.findFirst({
    where: {
      ownerId,
      key,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return record;
}

export {
  toProto,

  createData,
  getDataById,
  updateData,
  deleteData,

  getLatestHash,
  getLatest,
};