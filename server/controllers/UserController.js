import * as dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import User from '../mongodb/models/user.js'
import PostModel from '../mongodb/models/post.js'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const Update = async (req, res, next) =>
{
    try
    {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: req.body }, { new: true })

        const posts = updatedUser.posts

        await Promise.all
        (
            posts.map(async (postID) =>
            {
                return await PostModel.findByIdAndUpdate(postID, { profilePic: updatedUser.image })
            })
        )

        res.status(200).json(updatedUser)
    }
    catch(err)
    {
        next(err)
    }
}

export const Favourite = async(req, res) =>
{
    try
    {
        const imagePost = await PostModel.findByIdAndUpdate(req.body._id, { $addToSet: { likes: req.user.id }, $inc: { favouritesCount: 1 } })
        await User.findByIdAndUpdate(req.user.id, { $push: { favourites: req.body._id }}, { new: true })
        res.status(200).json(imagePost)  
    }
    catch(err)
    {
        next(err)
    }
}

export const Unfavourite = async(req, res) =>
{
    try
    {
        const imagePost = await PostModel.findByIdAndUpdate(req.body._id, { $pull: { likes: req.user.id }, $inc: { favouritesCount: -1 } })
        await User.findByIdAndUpdate(req.user.id, { $pull: { favourites: req.body._id }}, { new: true })
        res.status(200).json(imagePost)
    }
    catch(err)
    {
        next(err)
    }
}