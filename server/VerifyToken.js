import jwt from 'jsonwebtoken'
import { CreateError } from './Utils/Error.js';

export const VerifyToken = (req, res, next) =>
{
    const token = req.cookies.access_token;
    if (!token) return next(CreateError(401, 'You are not authenticated'))

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) =>
    {
        if (err) return next(CreateError(403, 'Token not valid'))

        req.user = user;
        next()
    })
}