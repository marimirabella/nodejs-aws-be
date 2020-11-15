import { ClientConfig } from 'pg';

export const { DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

export const dbConfig: ClientConfig = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
  database: DB_DATABASE,
  port: Number(DB_PORT),
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000, // number of milliseconds to wait for connection
};