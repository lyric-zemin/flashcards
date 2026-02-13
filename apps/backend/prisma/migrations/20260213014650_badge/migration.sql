-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Badge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'learning',
    "requiredValue" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Badge" ("condition", "description", "icon", "id", "name") SELECT "condition", "description", "icon", "id", "name" FROM "Badge";
DROP TABLE "Badge";
ALTER TABLE "new_Badge" RENAME TO "Badge";
CREATE UNIQUE INDEX "Badge_name_key" ON "Badge"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
