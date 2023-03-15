import express from 'express'
import { GoogleAuth, Signin, Signup, Logout, Verification, ResendVerificationEmail } from '../controllers/AuthController.js'

const router = express.Router()

//Create User
router.post('/signup', Signup)


//Log in
router.post('/signin', Signin)

//Google auth

router.post('/google', GoogleAuth)

router.post('/resend-email', ResendVerificationEmail)

router.get('/:id/verify/:token', Verification)

router.post('/logout', Logout)

export default router