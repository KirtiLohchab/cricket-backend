import pg from 'pg';

const { Pool } = pg;

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
};

const pool = new Pool(poolConfig);

export const connectDB = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      const client = await pool.connect();
      console.log('PostgreSQL connected successfully.');
      client.release();
      return pool;
    } catch (error) {
      retries -= 1;
      console.error(`Database connection failed. Retries left: ${retries}`, error.message);
      if (retries === 0) {
        console.error('All retries exhausted. Could not connect to the database. Exiting...');
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default pool;