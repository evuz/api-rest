import { Schema, Model, Document, model } from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import * as crypto from 'crypto';

export interface IUser {
    email: string,
    displayName: string,
    avatar: string,
    password: string,
    signUpDate: Date,
    lastLogin: Date,
    statsByMonths: [{
        id: number,
        totalStake?: number,
        totalOdd?: number,
        profits?: number,
        voidPicks?: number,
        lostPicks?: number,
        winPicks?: number
    }]
}



export interface IUserModel extends IUser, Document {
    validPassword(password: string): string,
    gravatar(): string
}

const schema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    displayName: String,
    avatar: String,
    password: String,
    signUpDate: { type: Date, default: Date.now() },
    lastLogin: Date,
    statsByMonths: [new Schema({
        id: Number,
        winPicks: { type: Number, default: 0 },
        lostPicks: { type: Number, default: 0 },
        voidPicks: { type: Number, default: 0 },
        profits: { type: Number, default: 0 },
        totalOdd: { type: Number, default: 0 },
        totalStake: { type: Number, default: 0 }
    })]
});

schema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) next(err);
            user.password = hash;
            next();
        })
    })
});

schema.methods.validPassword = function (password) {
    let user = this;
    return bcrypt.compareSync(password, user.password);
}

schema.methods.gravatar = function () {
    if (!this.email) return `https://gravatar.com/avatar/?s=200&d=retro`;

    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}

export const User: Model<IUserModel> = model<IUserModel>('User', schema);