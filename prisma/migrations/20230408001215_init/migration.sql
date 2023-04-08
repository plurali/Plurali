-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "pluralKey" TEXT,
    "overridePluralId" TEXT,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "dataId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserData" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "visible" BOOLEAN NOT NULL,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserField" (
    "id" TEXT NOT NULL,
    "pluralId" TEXT NOT NULL,
    "pluralOwnerId" TEXT NOT NULL,
    "dataId" TEXT,
    "userId" TEXT,

    CONSTRAINT "UserField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFieldData" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "visible" BOOLEAN NOT NULL,

    CONSTRAINT "UserFieldData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMember" (
    "id" TEXT NOT NULL,
    "pluralId" TEXT NOT NULL,
    "pluralOwnerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dataId" TEXT,

    CONSTRAINT "UserMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMemberData" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "visible" BOOLEAN NOT NULL,

    CONSTRAINT "UserMemberData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_dataId_key" ON "User"("dataId");

-- CreateIndex
CREATE UNIQUE INDEX "UserField_pluralId_key" ON "UserField"("pluralId");

-- CreateIndex
CREATE UNIQUE INDEX "UserField_dataId_key" ON "UserField"("dataId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMember_pluralId_key" ON "UserMember"("pluralId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMember_dataId_key" ON "UserMember"("dataId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "UserData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserField" ADD CONSTRAINT "UserField_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserField" ADD CONSTRAINT "UserField_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "UserFieldData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMember" ADD CONSTRAINT "UserMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMember" ADD CONSTRAINT "UserMember_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "UserMemberData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
