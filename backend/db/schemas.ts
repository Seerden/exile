import mongoose, { Schema, Document } from 'mongoose';

const valueSchema = new mongoose.Schema({
    date: Date,
    totalChaosValue: Number
})

export const stashValueSchema = new mongoose.Schema({
    accountName: String,
    league: String,
    value: [valueSchema]
})
