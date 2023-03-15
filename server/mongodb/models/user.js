import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema
({
    username:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true
    },
    password:
    {
        type: String
    },
    fromGoogle:
    {
        type: Boolean,
        default: false
    },
    verified:
    {
        type: Boolean,
        default: false
    },
    image:
    {
        type: String
    },
    posts:
    {
        type: [String]
    },
    favourites:
    {
        type: [String]
    },
    comments:
    {
        type: [String]
    }
}, { timestamps: true })

export default mongoose.model('User', UserSchema)