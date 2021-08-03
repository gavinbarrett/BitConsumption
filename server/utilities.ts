import * as superagent from 'superagent';
import * as db from './database';
import { QueryResult } from 'pg';

const url: string = 'https://cbeci.org/api/v1.1.0/download/data?price=0.05';

const addToDB = async (data) => {
	// add the data point(s) to the energy_usage table
	const query: string = 'insert into energy_usage (time, datetime, min, max, guess) values ($1, $2, $3, $4, $5)';
	// insert every line into the table
	for (let i in data) await db.queryVal(query, [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4]]);
}

export const checkDataSync = async () => {
	// make sure database exists
	await db.query('create table if not exists energy_usage (time integer, datetime timestamptz, min real, max real, guess real)');
	// get current date
	const date: string = getTargetDate();
    // check for yesterday's entry into the database
	const resp: QueryResult = await db.queryVal('select time from energy_usage where datetime=$1', [date]);
	// refresh data store if it is out of sync
    if (!resp.rows.length) refreshDataStore();
}

const getTargetDate = () => {
	// retrieve yesterday's date
	const today: Date = new Date();
	let yesterday: Date = new Date();
	// set the date for yesterday
	yesterday.setDate(today.getDate() - 1);
	// roll the day's counter back to 00:00:00
	return yesterday.toISOString().split("T")[0] + "T00:00:00";
}

const refreshDataStore = async () => {
	// synchronize the database with the CBECI data
	try {
		const resp = await superagent.get(url);
		const data: Array<string> = resp.text.split("\r\n");
		// pull data from the database to find the most recent data point
		const recent: QueryResult = await db.query('select time from energy_usage order by time desc');
		// remove headers and trailing newline
		data.shift(); data.shift(); data.pop();
		if (recent.rows.length) {
			// get the offset of the data; there should be one new data point every day
			const offset: number = recent.rows.length - data.length;
			console.log(`Data offset: ${offset}`);
			// we need to grab this many data points
		} else {
			// no rows in db, fill it with all of the data
			const split_data: Array<Array<string>> = data.map(elem => elem.split(","));
			addToDB(split_data);
		}
	} catch (err) {
		console.log(`Error`);
	}
}