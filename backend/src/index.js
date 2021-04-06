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
const server = app.listen(constants.BACKEND_API_PORT, () => console.log(`LISTENING ON PORT ${constants.BACKEND_API_PORT}`));
export default server


const x = require("./sendMails")
console.log(x)
x.default.sendMail()