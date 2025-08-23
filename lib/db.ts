import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  max: 5,
  idleTimeoutMillis: 30_000
});

export async function dbHealth() {
  try {
    // Lightweight no-op query
    const res = await pool.query('SELECT 1 as ok');
    return { ok: res.rows[0].ok === 1 };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

export async function exampleItemsCount() {
  try {
    const res = await pool.query('SELECT count(*)::int AS count FROM example_items');
    return { count: res.rows[0].count as number };
  } catch (e: any) {
    // Table might not exist yet
    return { count: 0, error: e.message };
  }
}
