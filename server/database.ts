import { Pool } from 'pg';

const pool: Pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: "bitconsume",
	password: '',
	port: 5432
});

export const query = (text: string) => {
	return pool.query(text);
}

export const queryVal = (text: string, values: Array<number|Date>) => {
    return pool.query(text, values);
}