-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imageId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Data"("id") ON DELETE SET NULL ON UPDATE CASCADE;
