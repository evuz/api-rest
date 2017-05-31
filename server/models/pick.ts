import { Schema, Model, Document, model } from 'mongoose';
import * as UserCtrl from '../controllers/user';

export interface IPick {
    author: string,
    date?: Date,
    publicDate: Date,
    sport?: string,
    competition?: string,
    match?: string,
    pick: string,
    tipster?: string,
    stake: number,
    odd: number,
    result: string,
    bookie?: string,
}

export interface IPickModel extends IPick, Document {

}

const schema = new Schema({
    author: String,
    date: Date,
    publicDate: { type: Date, default: Date.now() },
    sport: String,
    competition: String,
    match: String,
    pick: String,
    tipster: String,
    stake: Number,
    odd: Number,
    result: { type: String, enum: ['W', 'V', 'L', 'P'], default: 'P' },
    bookie: String,
});

export const Pick: Model<IPickModel> = model<IPickModel>('Pick', schema);
