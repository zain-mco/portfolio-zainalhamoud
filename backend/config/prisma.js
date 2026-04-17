const { PrismaClient } = require('../generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the Prisma adapter
const adapter = new PrismaPg(pool);

// Singleton pattern to prevent multiple Prisma Client instances in development
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter });
} else {
  // In development, reuse the client across hot reloads
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({ adapter });
  }
  prisma = global.__prisma;
}

module.exports = prisma;
