import * as express from 'express';
import { getChain, getChainRange } from './server/controllers';
import { checkDataSync } from './server/utilities';
const port = 5000;
const app = express();
app.use(express.json());

/* Download all energy usage data */
app.get('/getchain', getChain);

/* Download energy usage for a range of UNIX timestamps */
app.post('/getChainRange', getChainRange);

app.listen(port, () => {
	console.log(`Starting up BitConsumption server on port ${port}`);
	checkDataSync();
	// FIXME: set a setTimeout to call checkDataSync about every day 
});