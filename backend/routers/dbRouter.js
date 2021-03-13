import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import 'dotenv/config.js';
import axios from 'axios';

import {
    StashModel as Stash,
    StashValueModel as StashValue
} from '../db/db.js'

/**
 * Express router for /db routes, used as API endpoints for frontend interaction with the database.
 */
export const dbRouter = express.Router();
dbRouter.use(bodyParser.urlencoded({ limit: '5mb', parameterLimit: 10000, extended: true }));
dbRouter.use(bodyParser.json());

function logRequest(req, res, next) {
    console.log(`${req.originalUrl} - ${JSON.stringify(req.query)}`);
    next();
}

dbRouter.use(logRequest);

dbRouter.get('/', (req, res) => {
    res.send('/db/ GET successful')
})

// Stash Content interaction
//  note that POSTing stash state is handled in poeRouter, since that's where we grab the data from the POE API
dbRouter.get('/stashvalue', (req, res) => {
    // console.log(req.query);
    StashValue.findOne({ accountName: req.query.accountName }, (err, doc) => {
        if (err) {
            res.status(401).send('Error fetching stash value from database.');
        } else {
            res.send(doc)
        }
    })
})

