import express from 'express';
import 'dotenv/config.js';

import { StashValue, StashSnapshot, User } from '../db/db.js';
import { UserTabsInterface } from '../db/schemas/userSchema.js';
import { stashSnapshotValues } from '../helpers/db/dbHelpers.js';

/**
 * Express router for /db routes, used as API endpoints for frontend interaction with the database.
 */
export const dbRouter = express.Router();
dbRouter.use(express.urlencoded({ limit: '5mb', parameterLimit: 10000, extended: true }));
dbRouter.use(express.json());

function logRequest(req, res, next) {
    console.log(`${req.originalUrl} - ${JSON.stringify(req.query)}`);
    next();
}

dbRouter.use(logRequest);

dbRouter.get('/', (req, res) => {
    res.send('/db/ GET successful')
})

// Stash Content interaction
//   note that POSTing stash state is handled in poeRouter, since that's where we grab the data from the POE API
dbRouter.get('/stashvalue', async (req, res) => {
    // console.log(req.query);
    const { accountName, league } = req.query;

    const stashValues = await stashSnapshotValues(accountName, league);

    if (stashValues && stashValues.length > 0) {
        // console.log(stashValues);
        res.send(stashValues)
    } else {
        res.status(401).send('Error fetching stash values or empty response')
    }

    // StashValue.findOne({ accountName: req.query.accountName }, (err, doc) => {
    //     if (err) {
    //         res.status(401).send('Error fetching stash value from database.');
    //     } else {
    //         res.send(doc)
    //     }
    // })
})

dbRouter.post('/user', async (req, res) => {
    const { accountName, tabs } = req.body.user;
    findOrCreateUser(accountName, tabs)
        .then(newUser => {
            if (newUser) {
                res.send(newUser)
            } else {
                res.send('User already exists in database')
            }
        })
        .catch(err => res.status(403).send(err))
})

async function findOrCreateUser(accountName: string, tabs: UserTabsInterface) {
    const doc = await User.findOne({ accountName, tabs })
    if (!doc) {
        const newUser = new User({ accountName, tabs })
        return await newUser.save();
    }
}