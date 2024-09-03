import { Prisma } from "@prisma/client";

const resultOrNull = <A extends any[], R>(
  fn: (...args: A) => Promise<R>
): ((...args: A) => Promise<R | null>) => {
  return async (...args: A): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientRustPanicError) {
        throw error;
      }
      console.error(error);
      // If not a PrismaClientRustPanicError, return null
      return null;
    }
  };
};


export {
    resultOrNull,
}

