import express from 'express';
import createDBConnection from './config/db.js';
import bodyParser from 'body-parser';

import userRouter from './users/routes/user.routes.js';

import { createServer } from "http";
import cors from 'cors';
const app = express();
const server = createServer(app);
import dotenv from 'dotenv';
import chatRouter from './chat/routes/chat.routes.js';
import configureSocket from './socket.js';
import CustomError from './util/error.js';
dotenv.config();
var corsOptions = {
    origin: "http://127.0.0.1:5173"
  }
app.use(cors(corsOptions));

const SERVICE_PORT = process.env.SERVICE_PORT || 8000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())



const makeConnectionsReady = async () => {
    try {
        await createDBConnection();
        configureSocket(server)
    } catch (e) {
        let msg = e && e.message || "Not able to stablish connection with socket or db"
        let connectError = new Error(msg)
        return new CustomError(connectError)
    }
    
}

makeConnectionsReady();
server.listen(SERVICE_PORT,() => {
    console.log('server running on ' , SERVICE_PORT)
});

app.use("/api/v1/user",userRouter);
app.use("/api/v1/chat",chatRouter);

