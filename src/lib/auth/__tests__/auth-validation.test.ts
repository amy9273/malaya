import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateAuthCredentials } from '../validation';
import fs from 'node:fs';
import path from 'node:path';

// Synthetic dummy strings for unit testing (avoids false-positive secret scanner heuristics)
const MOCK_VALID_PASSWORD = 'mock-password-token';
const MOCK_SHORT_PASSWORD = '123';

describe('Auth Module — validateAuthCredentials', () => {
  it('accepts valid credentials with correct email and minimum password length', () => {
    const result = validateAuthCredentials({
      email: 'hunter@malaya.app',
      password: MOCK_VALID_PASSWORD,
    });

    assert.equal(result.success, true);
    assert.equal(result.data?.email, 'hunter@malaya.app');
  });

  it('accepts optional valid display name', () => {
    const result = validateAuthCredentials({
      email: 'jinwoo@malaya.app',
      password: MOCK_VALID_PASSWORD,
      displayName: 'Sung Jinwoo',
    });

    assert.equal(result.success, true);
    assert.equal(result.data?.displayName, 'Sung Jinwoo');
  });

  it('rejects malformed email addresses', () => {
    const result = validateAuthCredentials({
      email: 'not-an-email',
      password: MOCK_VALID_PASSWORD,
    });

    assert.equal(result.success, false);
    assert.ok(
      result.error?.includes('valid email'),
      `Expected email error message, got: ${result.error}`,
    );
  });

  it('rejects passwords shorter than 6 characters', () => {
    const result = validateAuthCredentials({
      email: 'valid@malaya.app',
      password: MOCK_SHORT_PASSWORD,
    });

    assert.equal(result.success, false);
    assert.ok(
      result.error?.includes('6 characters'),
      `Expected length error message, got: ${result.error}`,
    );
  });

  it('rejects display names shorter than 2 characters', () => {
    const result = validateAuthCredentials({
      email: 'valid@malaya.app',
      password: MOCK_VALID_PASSWORD,
      displayName: 'A',
    });

    assert.equal(result.success, false);
    assert.ok(
      result.error?.includes('2 characters'),
      `Expected display name length error, got: ${result.error}`,
    );
  });
});

describe('Database Schema & RLS Policies Verification', () => {
  it('verifies schema.prisma contains all domain models and enums', () => {
    const schemaPath = path.resolve(process.cwd(), 'prisma/schema.prisma');
    assert.ok(fs.existsSync(schemaPath), 'schema.prisma must exist');

    const content = fs.readFileSync(schemaPath, 'utf8');
    assert.ok(content.includes('model User'), 'User model missing');
    assert.ok(content.includes('model LibraryEntry'), 'LibraryEntry model missing');
    assert.ok(content.includes('model ReadingHistory'), 'ReadingHistory model missing');
    assert.ok(content.includes('enum ReadingStatus'), 'ReadingStatus enum missing');
    assert.ok(
      content.includes('@@unique([userId, seriesId])'),
      'Unique constraint missing',
    );
  });

  it('verifies rls-policies.sql enforces Row-Level Security on all tables', () => {
    const sqlPath = path.resolve(process.cwd(), 'prisma/rls-policies.sql');
    assert.ok(fs.existsSync(sqlPath), 'rls-policies.sql must exist');

    const sql = fs.readFileSync(sqlPath, 'utf8');
    assert.ok(
      sql.includes('ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;'),
      'User RLS missing',
    );
    assert.ok(
      sql.includes('ALTER TABLE "LibraryEntry" ENABLE ROW LEVEL SECURITY;'),
      'LibraryEntry RLS missing',
    );
    assert.ok(
      sql.includes('ALTER TABLE "ReadingHistory" ENABLE ROW LEVEL SECURITY;'),
      'ReadingHistory RLS missing',
    );
    assert.ok(sql.includes('auth.uid()'), 'auth.uid() policy check missing');
  });
});
