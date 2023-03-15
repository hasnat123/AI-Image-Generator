import express from 'express'
import { Favourite, Unfavourite, Update } from '../controllers/UserController.js'
import { VerifyToken } from '../VerifyToken.js'


const router = express.Router()

router.put('/', VerifyToken, Update)
router.put('/favourite', VerifyToken, Favourite)
router.put('/unfavourite', VerifyToken, Unfavourite)


export default router
