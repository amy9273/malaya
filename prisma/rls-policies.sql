-- ==============================================================================
-- MALAYA: POSTGRESQL ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Ensures strict multi-tenant isolation where users can only read, insert,
-- update, or delete records associated with their authenticated Supabase ID (auth.uid()).

-- 1. Enable RLS on all domain tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LibraryEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReadingHistory" ENABLE ROW LEVEL SECURITY;

-- 2. "User" Table Policies
-- Users can view their own user record
CREATE POLICY "Users can read own profile" ON "User"
  FOR SELECT
  USING (supabaseId = auth.uid()::text);

-- Users can update their own user record
CREATE POLICY "Users can update own profile" ON "User"
  FOR UPDATE
  USING (supabaseId = auth.uid()::text)
  WITH CHECK (supabaseId = auth.uid()::text);

-- Service role has full administrative bypass for user creation upon Supabase auth trigger
CREATE POLICY "Service role manages users" ON "User"
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- 3. "LibraryEntry" Table Policies
-- Users can view their own library items
CREATE POLICY "Users can read own library entries" ON "LibraryEntry"
  FOR SELECT
  USING (
    "userId" IN (
      SELECT id FROM "User" WHERE supabaseId = auth.uid()::text
    )
  );

-- Users can insert items into their own library
CREATE POLICY "Users can insert own library entries" ON "LibraryEntry"
  FOR INSERT
  WITH CHECK (
    "userId" IN (
      SELECT id FROM "User" WHERE supabaseId = auth.uid()::text
    )
  );

-- Users can update their own library entries
CREATE POLICY "Users can update own library entries" ON "LibraryEntry"
  FOR UPDATE
  USING (
    "userId" IN (
      SELECT id FROM "User" WHERE supabaseId = auth.uid()::text
    )
  )
  WITH CHECK (
    "userId" IN (
      SELECT id FROM "User" WHERE supabaseId = auth.uid()::text
    )
  );

-- Users can delete their own library entries
CREATE POLICY "Users can delete own library entries" ON "LibraryEntry"
  FOR DELETE
  USING (
    "userId" IN (
      SELECT id FROM "User" WHERE supabaseId = auth.uid()::text
    )
  );

-- 4. "ReadingHistory" Table Policies
-- Users can view their own reading history
CREATE POLICY "Users can read own reading history" ON "ReadingHistory"
  FOR SELECT
  USING (
    "userId" IN (
      SELECT id FROM "User" WHERE supabaseId = auth.uid()::text
    )
  );

-- Users can insert or upsert their own reading progress
CREATE POLICY "Users can insert own reading history" ON "ReadingHistory"
  FOR INSERT
  WITH CHECK (
    "userId" IN (
      SELECT id FROM "User" WHERE supabaseId = auth.uid()::text
    )
  );

-- Users can update their own reading progress
CREATE POLICY "Users can update own reading history" ON "ReadingHistory"
  FOR UPDATE
  USING (
    "userId" IN (
      SELECT id FROM "User" WHERE supabaseId = auth.uid()::text
    )
  )
  WITH CHECK (
    "userId" IN (
      SELECT id FROM "User" WHERE supabaseId = auth.uid()::text
    )
  );

-- Users can delete their own reading history
CREATE POLICY "Users can delete own reading history" ON "ReadingHistory"
  FOR DELETE
  USING (
    "userId" IN (
      SELECT id FROM "User" WHERE supabaseId = auth.uid()::text
    )
  );
