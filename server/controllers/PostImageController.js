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

// export const GetPosts = async(req, res) =>
// {
//     const page = req.query.page || 1
//     const pageSize = 10
 
//     try {
//         const totalPages = Math.ceil(await PostModel.countDocuments() / pageSize)
//         const startIndex = (totalPages - page) * pageSize
//         if (startIndex >= 0)
//         {
//             const posts = (await PostModel.find({}).skip(startIndex).limit(pageSize)).reverse()
//             res.status(200).json({ success: true, data: posts })
//         }
//         else
//         {
//             res.status(200).json({ success: true, data: [] })
//         }
        
//     } catch (error) {
//         res.status(500).json({ success: false, message: error })
//     }
// }

export const GetPosts = async(req, res) =>
{
    const page = req.query.page || 1
    const pageSize = 10
    const searchTerm = req.query.search || ''
 
    try {
        let query = {}
        if (searchTerm !== '') {
            query = {
                $or: [
                    {name: { $regex: searchTerm, $options: 'i' }},
                    {prompt: { $regex: searchTerm, $options: 'i' }}
                ]
            }
        }

        const count = await PostModel.countDocuments(query)
        const totalPages = Math.ceil(count / pageSize)
        const startIndex = (totalPages - page) * pageSize

        if (startIndex >= 0)
        {
            const posts = (await PostModel.find(query).skip(startIndex).limit(pageSize)).reverse()
            res.status(200).json({ success: true, data: posts })
        }
        else {
            res.status(200).json({ success: true, data: [] })
        }
        
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
}


export const GetFavouritePosts = async(req, res) => {
    const page = req.query.page || 1;
    const pageSize = 10;
    const searchTerm = req.query.search || '';
    
    try {
        const userId = req.user.id;
        const user = await UserModel.findById(userId);
        const favourites = user.favourites;
        let query = { _id: { $in: favourites }, userId };

        if (searchTerm !== '') {
            query = {
                $and: [
                    { _id: { $in: favourites } },
                    {
                        $or: [
                            { name: { $regex: searchTerm, $options: 'i' } },
                            { prompt: { $regex: searchTerm, $options: 'i' } }
                        ]
                    }
                ]
            }
        }

        const allFavourites = await PostModel.find(query);
        const favouritePosts = allFavourites.filter(post => favourites.includes(post._id.toString()))
        .sort((a,b) => {
            return favourites.indexOf(a._id.toString()) - favourites.indexOf(b._id.toString())
        });
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedPosts = favouritePosts.reverse().slice(startIndex, endIndex);
        const totalPages = Math.ceil(favouritePosts.length / pageSize);
    
        res.status(200).json({ success: true, data: paginatedPosts, totalPages });

    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}

export const GetUserPosts = async(req, res) =>
{
    const page = req.query.page || 1
    const pageSize = 10
    const searchTerm = req.query.search || ''
    
    try
    {
        const userId = req.user.id
        const user = await UserModel.findById(userId)
        const userPosts = user.posts;
        let query = { _id: { $in: userPosts }, userId }
        if (searchTerm !== '') {
            query = {
                $or: [
                    {name: { $regex: searchTerm, $options: 'i' }},
                    {prompt: { $regex: searchTerm, $options: 'i' }}
                ]
            }
        }

        
        const count = await PostModel.countDocuments(query)
        const totalPages = Math.ceil(count / pageSize)
        const startIndex = (totalPages - page) * pageSize
    
        if (startIndex >= 0)
        {
            const postList = (await PostModel.find(query)
            .skip(startIndex)
            .limit(pageSize)).reverse()
            res.status(200).json({ success: true, data: postList })
        }
        else
        {
            res.status(200).json({ success: true, data: [] })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
}

export const GetPost = async (req, res, next) =>
{
    try
    {
        const post = await PostModel.findById(req.params.id)
        if (!post) return res.status(404).json("Post not found")
        else res.status(200).json({ success: true, data: post })
    }
    catch (error)
    {
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
        const photoUrl = await cloudinary.uploader.upload(photo, { secure: true, resource_type: "auto", fetch_format: "auto", quality: "auto", crop: "limit" })
        const newPost = await PostModel.create({ name: user.username, prompt, photo: photoUrl.secure_url, profilePic: user.image})
        await UserModel.findByIdAndUpdate(req.user.id, { $push: { posts: newPost._id }}, { new: true })
        res.status(201).json({ success: true, data: newPost })
    }
    catch(err)
    {
        res.status(500).json({ success: false, message: err })
    }
}