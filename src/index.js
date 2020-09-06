import cors from 'cors'
import logger from 'morgan';
import bodyParser from 'body-parser'
import express from 'express'

import router from './models/routes'
import constants from './utils/constants'

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", router);
const server = app.listen(constants.API_PORT, () => console.log(`LISTENING ON PORT ${constants.API_PORT}`));
export default server