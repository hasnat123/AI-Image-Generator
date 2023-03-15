import express from 'express'
import { VerifyToken } from '../VerifyToken.js'
import { GetFavouritePosts, GetPosts, GetUserPosts, PostImage } from '../controllers/PostImageController.js'


const router = express.Router()

router.get('/', VerifyToken, GetPosts)
router.post('/', VerifyToken, PostImage)
router.get('/favourites', VerifyToken, GetFavouritePosts)
router.get('/user-posts', VerifyToken, GetUserPosts)

export default router
