-- AlterTable
ALTER TABLE "Center" ALTER COLUMN "studySystem" SET DEFAULT ARRAY['عربي']::TEXT[];

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "studySystem" SET DEFAULT ARRAY['عربي']::TEXT[];
