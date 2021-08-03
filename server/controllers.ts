import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import * as db from './database';

export const getChain = async (req: Request, res: Response) => {
	const all_data: QueryResult = await db.query('select * from energy_usage');
	res.send(JSON.stringify({"data": all_data.rows}));
}

export const getChainRange = async (req: Request, res: Response) => {
	const { start, end } = req.body;
	if (!Number.isInteger(start) || !Number.isInteger(end)) {
		res.status(400).end(JSON.stringify({"data": null}));
	} else {
		const data_range: QueryResult = await db.queryVal('select * from energy_usage where time >= $1 and time <= $2', [start, end]);
		res.send(JSON.stringify({"data": data_range.rows}));
	}
}