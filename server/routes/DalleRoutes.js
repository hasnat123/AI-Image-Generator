import express from 'express'
import { VerifyToken } from '../VerifyToken.js'
import { CreateImage } from '../controllers/DalleController.js'

const router = express.Router()

router.post('/', VerifyToken, CreateImage)

export default router