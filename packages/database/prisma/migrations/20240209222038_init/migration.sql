ALTER TABLE "Post" ADD COLUMN "slug" TEXT;

UPDATE "Post"
SET "slug" = LOWER(REPLACE(title, ' ', '-'));

ALTER TABLE "Post" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "Post" ADD CONSTRAINT "slug_unique" UNIQUE ("slug");