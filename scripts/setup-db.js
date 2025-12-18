#!/usr/bin/env node

/**
 * Setup database provider based on environment
 * - SQLite for local development
 * - PostgreSQL for production
 */

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const env = process.env.NODE_ENV || 'development';

// Detect database type from DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || '';
const isPostgres = databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://');
const isSQLite = databaseUrl.startsWith('file:');

let provider;
if (isPostgres) {
  provider = 'postgresql';
} else if (isSQLite) {
  provider = 'sqlite';
} else {
  // Default based on NODE_ENV
  provider = env === 'production' ? 'postgresql' : 'sqlite';
}

console.log(`🔧 Setting up database provider: ${provider}`);
console.log(`   Environment: ${env}`);
console.log(`   DATABASE_URL: ${databaseUrl.substring(0, 20)}...`);

// Read schema file
let schema = fs.readFileSync(schemaPath, 'utf8');

// Replace provider
schema = schema.replace(
  /datasource db \{[\s\S]*?provider = "(sqlite|postgresql)"[\s\S]*?\}/,
  `datasource db {\n  provider = "${provider}"\n  url      = env("DATABASE_URL")\n}`
);

// Write back
fs.writeFileSync(schemaPath, schema, 'utf8');

console.log(`✅ Database provider set to: ${provider}`);
