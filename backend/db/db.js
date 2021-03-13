import mongoose from 'mongoose';
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);

import { stashSchema, stashValueSchema, userSchema } from './schemas.js';

const uri = 'mongodb://localhost:27017/exile'
mongoose.connect(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

export const dbConnection = mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

dbConnection.on('connected', () => {
    console.log('Mongoose connection opened.');
})

dbConnection.on('error', () => {
    console.log('Error opening mongoose connection.');
})

export const UserModel = dbConnection.model('User', userSchema)
export const StashModel = dbConnection.model('Stash', stashSchema);
export const StashValueModel = dbConnection.model('StashValue', stashValueSchema)

