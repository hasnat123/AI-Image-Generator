import React from 'react'
import { Helmet, HelmetProvider } from "react-helmet-async";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';

const Adblock = () => {
  return (
    <HelmetProvider>
        <Helmet>
          <title>Dreamscape | AdBlock Detected</title>
        </Helmet>
        <div className='absolute p-3 left-0 top-0 flex flex-col justify-center items-center text-center w-[100%] h-[100%]'>
            <ReportGmailerrorredIcon sx={{ fontSize: {xs:'10rem', sm:'11rem', lg: '13rem' }}}className='text-[#222328] dark:text-[#eeeeee]'/>
            <h1 className='mt-5 font-extrabold text-[#222328] dark:text-[#eeeeee] text-[25px] sm:text-[28px] md:text-[35px] xl:text-[45px]'>AdBlock Detected</h1>
            <p className='mt-3 text-[#666e75] dark:text-[#CCCCCC] text-[16px] md:text-[19px] xl:text-[22px] max-w-[750px]'>We don't display any ads. Please whitelist our site so that things run smoothly. Once done, you can refresh the page.</p>
            <button className='font-inter font-medium bg-[#6f45d1] text-[1rem] md:text-[1.15rem] xl:text-[1.25rem] text-white mt-10 px-[20px] py-[10px] rounded-md' onClick={() => window.location.reload()}>Refresh</button>
        </div>
    </HelmetProvider>
  )
}

export default Adblock