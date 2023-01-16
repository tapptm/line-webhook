import { Pool } from 'pg';

export default new Pool ({
    max: 20,
    connectionString: process.env.PGURL,
    idleTimeoutMillis: 30000
});