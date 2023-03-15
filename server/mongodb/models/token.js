import mongoose from "mongoose";


const Token = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', unique: true },
    token: { type: String, required: true },
    createdAt: { type: Date , default: Date.now(), expiresIn: 3600 }
})

const TokenModel = mongoose.model('Token', Token)

export default TokenModel