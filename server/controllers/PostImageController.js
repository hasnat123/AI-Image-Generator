import * as dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import PostModel from '../mongodb/models/post.js'
import UserModel from '../mongodb/models/user.js'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

export const GetPosts = async(req, res) =>
{
    try {
        
        const posts = await PostModel.find({})
        res.status(200).json({ success: true, data: posts })
        
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
}

export const PostImage = async(req, res) =>
{
    try
    {
        // const { name, prompt, photo } = req.body
        const user = await UserModel.findById(req.user.id)
        const { prompt, photo } = req.body
        const photoUrl = await cloudinary.uploader.upload(photo, { secure: true, resource_type: "auto" })
        const newPost = await PostModel.create({ name: user.username, prompt, photo: photoUrl.url, profilePic: user.image})
        await UserModel.findByIdAndUpdate(req.user.id, { $push: { posts: newPost._id }}, { new: true })
        res.status(201).json({ success: true, data: newPost })
    }
    catch(err)
    {
        res.status(500).json({ success: false, message: err })
    }
}

export const GetFavouritePosts = async(req, res) =>
{
    try
    {
        const user = await UserModel.findById(req.user.id)
        const favourites = user.favourites;

        
        const favouritesList = await Promise.all
        (
            favourites.map(async (_id) =>
            {
                return await PostModel.find({ _id: _id })
            })
        )
        res.status(200).json({ success: true, data: favouritesList.flat().sort((a, b) => b.createdAt - a.createdAt) })

    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
}

export const GetUserPosts = async(req, res) =>
{
    try
    {
        const user = await UserModel.findById(req.user.id)
        const userPosts = user.posts;

        
        const UserPostsList = await Promise.all
        (
            userPosts.map(async (_id) =>
            {
                return await PostModel.find({ _id: _id })
            })
        )
        res.status(200).json({ success: true, data: UserPostsList.flat().sort((a, b) => b.createdAt - a.createdAt) })

    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
}