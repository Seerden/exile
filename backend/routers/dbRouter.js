import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import 'dotenv/config.js';

/**
 * Express router for /db routes, used as API endpoints for frontend interaction with the database.
 */
export const dbRouter = express.Router();
dbRouter.use(bodyParser.urlencoded({ limit: '5mb', parameterLimit: 10000, extended: true }));
dbRouter.use(bodyParser.json());

dbRouter.get('/', (req, res) => {
    res.send('/db/ GET successful')
})