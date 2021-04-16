import mongoose, { Document } from 'mongoose';

interface NinjaSnapshotInterface extends Document {
    date: Date,
    league: string,
    lines: Object[]
}

export const ninjaSnapshotSchema = new mongoose.Schema({
    date: new Date,
    league: String,
    lines: Array
})

export default mongoose.model<NinjaSnapshotInterface>('NinjaSnapshot', ninjaSnapshotSchema);