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