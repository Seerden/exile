import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    accountName: String,
    POESESSID: String,
    stash: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StashSnapshot'
        }
    ]
})

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

const valueSchema = new mongoose.Schema({
    date: Date,
    totalChaosValue: Number
})

export const stashValueSchema = new mongoose.Schema({
    accountName: String,
    league: String,
    value: [valueSchema]
})
