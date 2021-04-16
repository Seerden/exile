import mongoose, { Schema, Document } from 'mongoose';
import { connection } from '../db.js';

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

export interface StashSnapshotInterface extends Document {
    accountName: string,
    league: string,
    date: Date,
    items: {typeLine: string, stackSize: number, chaosValue: number}[]
};