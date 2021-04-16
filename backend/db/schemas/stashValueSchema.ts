import mongoose, { Document } from 'mongoose';
import { connection } from '../db.js';

export const stashValueSchema = new mongoose.Schema({
    accountName: String,
    league: String,
    value: [{date: Date, totalChaosValue: Number}]
})

export interface StashValueInterface extends Document {
    accountName: string,
    league: String,
    value: {date: Date, totalChaosValue: number}[]
}