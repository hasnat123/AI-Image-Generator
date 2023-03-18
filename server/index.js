import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import CookieParser from 'cookie-parser'

import AuthRoutes from './routes/AuthRoutes.js'
import PostImageRoutes from './routes/PostImageRoutes.js'
import DalleRoutes from './routes/DalleRoutes.js'
import UserRoutes from './routes/UserRoutes.js'


import connectDB from './mongodb/connect.js'

const app = express()
dotenv.config()

const corsOptions ={
    origin: ['http://localhost:5173', 'https://imagegeneratorai-server.onrender.com', 'http://imagegeneratorai-9kb4.onrender.com', 'https://imagegeneratorai-client.onrender.com', 'https://www.dreamscapepro.com', 'https://dreamscapepro.com', 'https://api.dreamscapepro.com', 'http://localhost:8080'],
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(express.json({ limit: '50mb' }))
app.use(CookieParser())
app.use(cors(corsOptions))

app.use('/api/v1/auth', AuthRoutes)
app.use('/api/v1/post', PostImageRoutes)
app.use('/api/v1/dalle', DalleRoutes)
app.use('/api/v1/user', UserRoutes)

app.get('/', async (req, res) => {
    res.status(200).json({
      message: 'Hello from Dreamscape!',
    });
  });

app.use((err, req, res, next) =>
{
    const status = err.status || 500
    const message = err.message || 'Something went wrong'

    return res.status(status).json({
        success: false,
        status,
        message
    })

})

if (process.env.NODE_ENV === 'production') {
    //*Set static folder up in production
    app.use(express.static('client/dist'));

    app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html')));
  }

const startServer = async() =>
{
    try
    {
        connectDB(process.env.MONGODB_URL)

        app.listen(process.env.PORT, () =>
        {
            console.log(`Listening to port http://localhost:${process.env.PORT}`)
        })
    }
    catch (err)
    {
        console.log(err)
    }
}

startServer()