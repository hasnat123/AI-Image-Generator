import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { auth, provider} from '../Firebase'
import { signInWithPopup } from 'firebase/auth'
import ReCAPTCHA from "react-google-recaptcha";
import { Form } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { googleStart, loginFailure, loginStart, loginSuccess, signupStart, signupSuccess } from '../Redux/UserSlice'

import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';

const Signin = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { loginLoading, signupLoading, googleLoading } = useSelector((state) => state.user)

    const [signinForm, setSigninForm] = useState({
        email: '',
        password: ''
    })

    const [signupForm, setSignupForm] = useState({
        username: '',
        email: '',
        password: ''
    })

    const [signinError, setSigninError] = useState('')
    const [signupError, setSignupError] = useState('')


    const [popup, setPopup] = useState(false)
    const [resend, setResend] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(false);

    const recaptchaRef = useRef(null);

    const HandleChangeSignin = (e) =>
    {
      setSigninForm({...signinForm, [e.target.name]: e.target.value})
    }

    const HandleChangeSignup = (e) =>
    {
      setSignupForm({...signupForm, [e.target.name]: e.target.value})
    }

    const HandleSignin = async (e) =>
    {
      e.preventDefault()
      
      const signinRecaptchaToken = await recaptchaRef.current.executeAsync()
      console.log(signinRecaptchaToken)
      
      if(signinRecaptchaToken)
      {
        dispatch(loginStart())
        
        try
        {
          const res = await axios.post('http://localhost:8080/api/v1/auth/signin', { ...signinForm }, { withCredentials: true })
          dispatch(loginSuccess(res.data))
          setSignupError('')
          setSigninError('')
          navigate('/')
          console.log(res)
        }
        catch(err)
        {
          setSigninError(err.response.data.message)
          dispatch(loginFailure())
        }

        recaptchaRef.current.reset();

      }

      else alert('Please complete the reCAPTCHA challenge');

    }

    const HandleSigninGoogle = async () =>
    {
      const signinRecaptchaToken = await recaptchaRef.current.executeAsync()
      console.log(signinRecaptchaToken)
      if(signinRecaptchaToken)
      {
        dispatch(googleStart())
        signInWithPopup(auth, provider)
        .then((res) =>
        {
          axios.post('http://localhost:8080/api/v1/auth/google',
          {
            username: res.user.displayName,
            email: res.user.email,
            image: res.user.photoURL
          }, { withCredentials: true }).then((res) =>
          {
            dispatch(loginSuccess(res.data))
            setSignupError('')
            setSigninError('')
            navigate('/')
          })
        })
        .catch((err) =>
        {
          dispatch(loginFailure())
        })

        recaptchaRef.current.reset();

      }

      else alert('Please complete the reCAPTCHA challenge');

    }

    const HandleSignup = async (e) =>
    {
      e.preventDefault()

      const signinRecaptchaToken = await recaptchaRef.current.executeAsync()
      console.log(signinRecaptchaToken)
      if(signinRecaptchaToken)
      {
        dispatch(signupStart())
        try
        {
          const res = await axios.post('http://localhost:8080/api/v1/auth/signup', { ...signupForm }, { withCredentials: true })
          dispatch(signupSuccess())
          if (res.data.message && res.data.message === 'Verification') setPopup(true)
          setSignupError('')
          setSigninError('')
          console.log(res)
        }
        catch(err)
        {
          setSignupError(err.response.data.message)
          dispatch(loginFailure())
        }

        recaptchaRef.current.reset();
      }

      else alert('Please complete the reCAPTCHA challenge');

    }

    const HandleClose = () =>
    {
      setSignupForm({username: '', email: '', password: ''})
      setPopup(false)
      setResend(false)
      setResendCooldown(false)
    }

    const HandleResend = async (e) =>
    {
      e.preventDefault()
      if(!resendCooldown)
      {
        try
        {
          const res = await axios.post('http://localhost:8080/api/v1/auth/resend-email', { ...signupForm }, { withCredentials: true })
          setResend(true)
          setResendCooldown(true)
          setTimeout(() => setResendCooldown(false), 10 * 60 * 1000);
          console.log(res)
        }
        catch(err)
        {
          console.log(err.response.data.message)
        }
      }
      else console.log("10 mins cooldown")

    }

  return (
    <div className='flex flex-col justify-center items-center'>
        {popup &&
          (<div className='fixed z-10 flex justify-center items-center w-[100%] h-[100%] top-0 bg-black bg-opacity-80'>
            <div className='p-5 relative flex flex-col justify-center items-center text-center w-[90%] max-w-[1000px] h-[90%] sm:w-[80%] sm:h-[80%] dark:bg-[#222328] bg-[#eeeeee] rounded-[1rem] sm:rounded-[2rem]'>
              <CloseIcon sx={{ fontSize: { md: '2rem' }}} className='bg-[#222328] dark:bg-[#eeeeee] absolute top-[15px] sm:top-[20px] right-[15px] sm:right-[20px] dark:text-[#222328] text-[#eeeeee] cursor-pointer rounded-[5px]' onClick={HandleClose}/>
              <EmailIcon sx={{ fontSize: {xs:'7rem', sm:'8rem', lg: '10rem' }}}className='dark:text-[#222328] text-[#eeeeee] p-6 bg-[#222328] dark:bg-[#eeeeee] rounded-full'/>
              <h1 className='mt-10 font-extrabold text-[#222328] dark:text-[#eeeeee] text-[25px] sm:text-[28px] md:text-[35px] xl:text-[45px]'>{resend ? 'Email Resent' : 'Verify your email'}</h1>
              <p className='mt-3 text-[#666e75] dark:text-[#CCCCCC] text-[16px] md:text-[19px] xl:text-[22px] max-w-[750px]'>{resend ? `A verification link has been re-sent to ${signupForm.email}. The link will expire in 1 hour.` : `an email has been sent to ${signupForm.email}. Please click the link in the email to activate your account. The link will expire in 1 hour.`}</p>
              {resend ? (<p className='mt-10 text-[#666e75] dark:text-[#CCCCCC] text-[16px] md:text-[19px] xl:text-[22px] max-w-[750px]'><span className={resendCooldown ? 'font-bold underline cursor-not-allowed' : 'font-bold underline cursor-pointer'} onClick={HandleResend}>Click here</span> after 10 minutes if you still did not receive an email.</p>) : (<p className='mt-10 text-[#666e75] dark:text-[#CCCCCC] text-[16px] md:text-[19px] xl:text-[22px] max-w-[750px]'><span className='font-bold underline cursor-pointer' onClick={HandleResend}>Click here</span> if you did not receive an email.</p>)}
            </div>
          </div>)
        }
        
        <ReCAPTCHA ref={recaptchaRef} size='invisible' sitekey="6LdQjv8kAAAAAP4MJo7UUDnifywKzWyI5IceufW7"/>

        <div className='m-auto mt-0 sm:mt-[7vh] flex items-center sm:border-[2px] border-gray-300 rounded-[20px]  flex-col gap-[3px] sm:gap-[10px] p-[1rem] sm:p-[2rem] w-[97%] max-w-[450px]'>
            <h1 className='font-extrabold text-[#222328] dark:text-[#eeeeee] text-[28px] sm:text-[32px] text-center'>Sign in</h1>
            <h2 className='my-1 text-[#666e75] dark:text-[#CCCCCC] text-[16px] sm:text-[20px] text-center max-w-[500px]'>To continue to Dreamcast</h2>
            <Form type='email' name='email' value={signinForm.email} placeholder='Email' HandleChange={HandleChangeSignin}/>
            <Form type='password' name='password' value={signinForm.password} placeholder='Password' HandleChange={HandleChangeSignin}/>
            { signinError && (<div className='mt-2 text-[#222328] dark:text-[#eeeeee]'>{signinError}</div>) }

            <button
                onClick={HandleSignin}
                className='font-inter font-medium bg-[#6f45d1] text-white mt-[15px] px-[20px] py-[10px] rounded-md'
            >{loginLoading ? 'loading...' : 'Sign in'}</button>
            <span className='w-[80%] h-0.5 my-[2vh] border-b border-gray-300'></span>
            <button
                onClick={HandleSigninGoogle}
                className='font-inter font-medium bg-[#6f45d1] text-white my-[1vh] px-[20px] py-[10px] rounded-md'
            >{googleLoading ? 'loading...' : 'Sign in with Google'}</button>
            <span className='w-[80%] h-0.5 my-[2vh] border-b border-gray-300'></span>
            <Form type='text' name='username' value={signupForm.username} placeholder='Username' HandleChange={HandleChangeSignup}/>
            <Form type='email' name='email' value={signupForm.email} placeholder='Email' HandleChange={HandleChangeSignup}/>
            <Form type='password' name='password' value={signupForm.password} placeholder='Password' HandleChange={HandleChangeSignup}/>
            { signupError && (<div className='mt-2 text-[#222328] dark:text-[#eeeeee]'>{signupError}</div>) }

            <button
                onClick={HandleSignup}
                className='font-inter font-medium bg-[#6f45d1] text-white my-[15px] px-[20px] py-[10px] rounded-md'
            >{signupLoading ? 'loading...' : 'Sign up'}</button>
        </div>
    </div>
  )
}

export default Signin