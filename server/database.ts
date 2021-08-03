import { Pool } from 'pg';

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: "bitconsume",
	password: '',
	port: 5432
});

export const query = (text) => {
	return pool.query(text);
}

export const queryVal = (text, values) => {
    return pool.query(text, values);
}