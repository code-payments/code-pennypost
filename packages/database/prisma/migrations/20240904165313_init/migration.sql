-- CreateTable
CREATE TABLE "TipIntent" (
    "intentId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "destination" TEXT NOT NULL,

    CONSTRAINT "TipIntent_pkey" PRIMARY KEY ("intentId")
);

-- AddForeignKey
ALTER TABLE "TipIntent" ADD CONSTRAINT "TipIntent_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipIntent" ADD CONSTRAINT "TipIntent_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "Intent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
