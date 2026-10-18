import { Pool } from 'pg';

let pool: Pool;

export const connectDB = async (): Promise<void> => {
  try {
    // Use DATABASE_URL if available, otherwise fall back to individual env vars
    const databaseUrl = process.env.DATABASE_URL;
    
    if (databaseUrl) {
      pool = new Pool({
        connectionString: databaseUrl,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    } else {
      pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'orders_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }

    await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL database for orders service');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export const query = (text: string, params?: any[]): Promise<any> => {
  if (!pool) {
    throw new Error('Database not connected');
  }
  return pool.query(text, params);
};

export const getPool = (): Pool => {
  if (!pool) {
    throw new Error('Database not connected');
  }
  return pool;
};