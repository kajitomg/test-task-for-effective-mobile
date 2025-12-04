-- CreateTable
CREATE TABLE "authTokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "refresh" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authTokens_user_id_key" ON "authTokens"("user_id");

-- AddForeignKey
ALTER TABLE "authTokens" ADD CONSTRAINT "authTokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
