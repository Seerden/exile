import mongoose, { Document, Schema } from 'mongoose';

export const userSchema: Schema = new mongoose.Schema({
    accountName: String,
    tabs: [{
        league: String,
        tabIndices: Array,
        tabProps: Array,
        lastUpdated: Date
    }]
})

export interface UserTabsInterface {
    league: string,
    tabIndices: number[],
    tabProps: string[],
    lastUpdated: Date
}

export interface UserInterface extends Document {
    accountName: string,
    tabs: UserTabsInterface[],
}