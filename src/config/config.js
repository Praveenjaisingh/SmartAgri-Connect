require('dotenv').config();
const pg = require('pg');

/**
 * Parse DATABASE_URL safely, decoding any percent-encoded characters
 * (e.g. Pass%40word → Pass@word) so the pg driver receives a plain string.
 */
function parseDbUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return {
      username: parsed.username ? decodeURIComponent(parsed.username) : undefined,
      password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
      database: parsed.pathname ? decodeURIComponent(parsed.pathname.slice(1)) : undefined,
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 5432,
    };
  } catch (e) {
    return null;
  }
}

const urlParsed = parseDbUrl(process.env.DATABASE_URL);

// Shared SSL options for Supabase / Neon / any hosted Postgres
const sslOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
};

const sharedOptions = {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
  dialectOptions: process.env.DATABASE_URL ? sslOptions : {},
};

module.exports = {

  development: urlParsed ? {
    // Use DATABASE_URL (decoded) when available
    username: urlParsed.username,
    password: urlParsed.password,
    database: urlParsed.database,
    host: urlParsed.host,
    port: urlParsed.port,
    ...sharedOptions,
  } : {
    // Fallback to individual env vars
    username: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD ?? ''),
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    ...sharedOptions,
  },

  test: {
    username: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD ?? ''),
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    ...sharedOptions,
  },

  production: urlParsed ? {
    username: urlParsed.username,
    password: urlParsed.password,
    database: urlParsed.database,
    host: urlParsed.host,
    port: urlParsed.port,
    ...sharedOptions,
  } : {
    use_env_variable: 'DATABASE_URL',
    ...sharedOptions,
  },

};
