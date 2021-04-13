import mongoose, { Schema, Document } from 'mongoose';

export const stashSnapshotSchema = new mongoose.Schema({
    accountName: String,
    league: String,
    date: Date,
    items: [{
        typeLine: String,
        stackSize: Number,
        chaosValue: Number
    }]
})

interface StashSnapshotInterface extends Document {
    accountName: string,
    league: string,
    date: Date,
    items: {typeLine: string, stackSize: number, chaosValue: number}[]
};

export default mongoose.model<StashSnapshotInterface>('StashSnapshot', stashSnapshotSchema)