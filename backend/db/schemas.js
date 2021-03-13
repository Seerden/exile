import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    accountName: String,
    POESESSID: String,
    stash: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stash'
        }
    ]
})

export const stashSchema = new mongoose.Schema({
    accountName: String,
    league: String,
    items: {
        typeLine: String,
        data: [
            {
                date: Date,
                stackSize: Number,
                piecePrice: Number
            }
        ]
    }
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
