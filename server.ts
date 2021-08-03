import * as express from 'express';
import { setupDataSyncHandler } from './server/utilities';
import { getChain, getChainRange } from './server/controllers';
const port = 5000;
const app = express();
app.use(express.json());

/* Download all energy usage data */
app.get('/getchain', getChain);
/* Download energy usage for a range of UNIX timestamps */
app.post('/getChainRange', getChainRange);

app.listen(port, () => {
	console.log(`Starting up BitConsumption on ${port}`);
	setupDataSyncHandler();
});