import mongoose from 'mongoose';
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);

import {StashValueInterface, stashValueSchema } from './schemas/stashValueSchema.js';
import {StashSnapshotInterface, stashSnapshotSchema} from './schemas/stashSnapshotSchema.js';
import {ninjaSnapshotSchema, NinjaSnapshotInterface} from './schemas/ninjaSnapshotSchema.js';
import { userSchema, UserInterface } from './schemas/userSchema.js';


const uri = 'mongodb://localhost:27017/exile'

export const connection = await mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export const StashSnapshot = connection.model('StashSnapshot', stashSnapshotSchema)
export const StashValue = connection.model('StashValue', stashValueSchema);
export const NinjaSnapshot = connection.model<NinjaSnapshotInterface>('NinjaSnapshot', ninjaSnapshotSchema)
export const User =  connection.model<UserInterface>('User', userSchema);

console.log('models:', connection.modelNames());

// connection.on('connected', () => { console.log('Mongoose connected!') })
// connection.on('error', () => { console.log('Mongoose connected!') })

