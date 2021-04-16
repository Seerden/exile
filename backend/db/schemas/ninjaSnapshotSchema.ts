import mongoose, { Document } from 'mongoose';
import { connection } from '../db.js';

export interface NinjaSnapshotInterface extends Document {
    date: Date,
    league: string,
    values: {date: Date, chaosValues: any[]}[]
}

export const ninjaSnapshotSchema = new mongoose.Schema({
    date: Date,
    league: String,
    values: Array
})