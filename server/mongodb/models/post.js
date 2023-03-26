import mongoose from "mongoose";


const Post = new mongoose.Schema({
    name: { type: String, required: true },
    prompt: { type: String, required: true },
    photo: { type: String, required: true },
    profilePic: { type: String },
    favouritesCount: { type: Number, default: 0 },
    likes: { type: [String], default: [] }
})

const PostModel = mongoose.model('Post', Post)

export default PostModel