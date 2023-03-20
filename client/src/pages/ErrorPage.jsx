import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-[1rem] text-center mt-[15vh]'>
      <h1 className='font-extrabold text-[#222328] dark:text-[#eeeeee] text-[56px] sm:text-[87.5px]'>404</h1>
      <h2 className='text-[#222328] dark:text-[#eeeeee] text-[16px] sm:text-[25px] max-w-[500px]'>Oops! Page Not Found</h2>
      <p className='text-[#666e75] dark:text-[#CCCCCC] text-[16px] sm:text-[25px] max-w-[500px]'>The page you are looking for does not seem to exist</p>
      <Link to='/' className='mt-2 sm:mt-4 font-inter font-medium bg-[#6f45d1] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-md sm:text-[1.25rem]'>Go Back</Link>
    </div>
  )
}

export default ErrorPage