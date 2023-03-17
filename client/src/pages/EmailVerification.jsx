import axios from 'axios'
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const EmailVerification = () => {

    const params = useParams()

    useEffect(() =>
    {
        const Verify = async() =>
        {
            try {
                const res = await axios.get(`https://imagegeneratorai-server.onrender.com/api/v1/auth/${params.id}/verify/${params.token}`)
                console.log(res.data)
            } catch (error) {
                console.log(error.response.data.message)
            }
        }
        Verify()
        
    }, [params])

  return (
    <div className='absolute p-3 left-0 top-0 flex flex-col justify-center items-center text-center w-[100%] h-[100%]'>
        <CheckCircleIcon sx={{ fontSize: {xs:'7rem', sm:'8rem', lg: '10rem' }}}className='dark:text-[#222328] text-[#eeeeee] bg-[#222328] dark:bg-[#eeeeee] rounded-full'/>
        <h1 className='mt-10 font-extrabold text-[#222328] dark:text-[#eeeeee] text-[25px] sm:text-[28px] md:text-[35px] xl:text-[45px]'>Success!</h1>
        <p className='mt-3 text-[#666e75] dark:text-[#CCCCCC] text-[16px] md:text-[19px] xl:text-[22px] max-w-[750px]'>Your account has been verified. You can now sign in.</p>
        <Link to='/'><button className='font-inter font-medium bg-[#6f45d1] text-[1rem] md:text-[1.15rem] xl:text-[1.25rem] text-white mt-10 px-[20px] py-[10px] rounded-md'>Sign in</button></Link>
    </div>
  )
}

export default EmailVerification