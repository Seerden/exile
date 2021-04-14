import mongoose, { Document, Schema } from 'mongoose';

export const userSchema: Schema = new mongoose.Schema({
    accountName: String,
    tabs: [{
        league: String,
        tabIndices: Array,
        tabProps: Array,
        lastUpdated: Date

    }]
    // POESESSID: String,
    // stash: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'StashSnapshot'
    //     }
    // ]
})

export interface UserTabsInterface {
    league: string,
    tabIndices: number[],
    tabProps: string[],
    lastUpdated: Date
}

export interface UserInterface extends Document {
    accountName: string,
    tabs: UserTabsInterface,
}

export const User = mongoose.model<UserInterface>('User', userSchema);