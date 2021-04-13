import mongoose from 'mongoose';
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);

import { stashValueSchema } from './schemas.js';
import { stashSnapshotSchema } from './schemas/stashSnapshotSchema.js';
import { userSchema, UserInterface } from './schemas/userSchema';


const uri = 'mongodb://localhost:27017/exile'

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

// export const UserModel = dbConnection.model('User', userSchema)
export const StashSnapshotModel = dbConnection.model('Stash', stashSnapshotSchema);
export const StashValueModel = dbConnection.model('StashValue', stashValueSchema)

