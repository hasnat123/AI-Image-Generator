import mongoose from 'mongoose'
import User from '../mongodb/models/user.js'
import Token from '../mongodb/models/token.js'
import bcrypt from 'bcryptjs'
import { CreateError } from '../Utils/Error.js'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import { EmailVerification } from '../Utils/EmailVerification.js'
import crypto from 'crypto'

export const Signup = async (req, res, next) =>
{
    try
    {
        if (!req.body.username || !req.body.email || !req.body.password) throw Error('All fields must be filled')
        if (!validator.isEmail(req.body.email)) throw Error('Email is not valid')
        if (!validator.isStrongPassword(req.body.password)) throw Error('Password not strong enough')

        const user = await User.findOne({ email: req.body.email })
        if (user) throw Error('Email already exists')

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)
        const newUser = new User({...req.body, password: hash})

        await newUser.save()

        // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' })
        // const {password, ...others} = newUser._doc; //Not including password in response

        const token = await new Token({ userID: newUser._id, token: crypto.randomBytes(32).toString('hex') }).save()

        const url = `${process.env.BASE_URL}users/${newUser._id}/verify/${token.token}`
        await EmailVerification(newUser.email, `Click the link to verify your email: ${url}`)

        return res.status(200).json({ message: 'Verification' })
        // res.cookie('access_token', token, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 * 3 }).status(200).json(others)
    }
    catch (err)
    {
        next(err)
    }
}

export const Signin = async (req, res, next) =>
{
    try
    {
        if (!req.body.email || !req.body.password) throw Error('All fields must be filled')

        const user = await User.findOne({ email: req.body.email })
        if (!user) return next(CreateError(404, "User not found"))

        if (user.fromGoogle) return next(CreateError(404, "Please sign in with Google"))

        const isCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!isCorrect) return next(CreateError(400, "Wrong credentials"))

        if (!user.verified)
        {
            let token = await Token.findOne({ userID: user._id })
            if (!token)
            {
                token = await new Token({ userID: user._id, token: crypto.randomBytes(32).toString('hex') }).save()
                const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`
                await EmailVerification(user.email, `Click the link to verify your email: ${url}`)
            }
            return res.status(400).json({ message: 'Please check your email to verify your account' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' })
        const {password, ...others} = user._doc; //Not including password in response

        res.cookie('access_token', token, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 * 3 }).status(200).json(others)
    }
    catch (err)
    {
        next(err)
    }
}

export const GoogleAuth = async (req, res, next) =>
{
    try
    {
        const user = await User.findOne({ email: req.body.email })
        if (user)
        {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' })
            res.cookie('access_token', token, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 * 3 }).status(200).json(user._doc)
        }
        else
        {
            const newUser = new User({ ...req.body, fromGoogle: true })
            const savedUser = await newUser.save()
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' })
            res.cookie('access_token', token, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 * 3 }).status(200).json(savedUser._doc)

        }
    }
    catch(err)
    {
        next(err)
    }
}

export const Verification = async (req, res, next) =>
{
    try
    {
        const user = await User.findOne({ _id: req.params.id })
        if (!user) return next(CreateError(400, "Invalid link"))

        const token = await Token.findOne({
            userID: user._id,
            token: req.params.token
        })
        if (!token) return next(CreateError(400, "Invalid link"))

        await user.updateOne({ verified: true})

        res.status(200).json({ success: true, message: 'Email verified successfully' })
    }
    catch(error)
    {
        next(error)
    }
}

export const ResendVerificationEmail = async (req, res, next) =>
{
    try
    {
        const user = await User.findOne({ email: req.body.email })
        if (!user) return next(CreateError(404, "User not found"))

        if (!user.verified)
        {
            let token = await Token.findOne({ userID: user._id })
            if (!token)
            {
                token = await new Token({ userID: user._id, token: crypto.randomBytes(32).toString('hex') }).save()
            }
            const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`
            await EmailVerification(user.email, 'Verify Email', `Click the link to verify your email: ${url}`)

            return res.status(200).json({ message: 'Verification email resent' })
        }
    }
    catch (err)
    {
        next(err)
    }
}

export const Logout = async (req, res, next) =>
{
    try
    {
        res.clearCookie('access_token')
        res.status(200).json('Logout success')
    }
    catch (err)
    {
        next(err)
    }
}