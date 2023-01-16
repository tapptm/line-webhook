import { Pool } from 'pg';
import dotenv from "dotenv";
dotenv.config();

export default new Pool ({
    max: 20,
    connectionString: process.env.PGURL,
    idleTimeoutMillis: 30000
});