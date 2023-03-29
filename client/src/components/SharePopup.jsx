import React, { useState } from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

    import {

    FacebookIcon, FacebookShareButton,
    TwitterIcon, TwitterShareButton,
    WhatsappIcon, WhatsappShareButton,
    TelegramIcon, TelegramShareButton,
    PinterestIcon, PinterestShareButton,
    LinkedinIcon, LinkedinShareButton,
    EmailIcon, EmailShareButton

  
  } from 'react-share'
import { copyIcon } from '../assets';
import { remove } from '../Redux/PostsSlice';
import { useDispatch, useSelector } from 'react-redux';


  const CustomPrevArrow = (props) => {
    const { onClick, isDisabled } = props;
    return (
      <ArrowBackIosNewIcon onClick={onClick} sx={{fontSize: '2.4rem', display: isDisabled ? 'none' : 'inline-block'}} className='text-[#eeeeee] absolute rounded-full p-2.5 bg-[#222328] left-[-1.25rem] z-10 top-[50%] translate-y-[-50%] shadow-share_button cursor-pointer'/>
    );
  };
  
  const CustomNextArrow = (props) => {
    const { onClick, isDisabled } = props;
    return (
      <ArrowForwardIosIcon onClick={onClick} sx={{fontSize: '2.4rem', display: isDisabled ? 'none' : 'inline-block'}} className='text-[#eeeeee] absolute rounded-full p-2.5 bg-[#222328] right-[-1.25rem] z-10 top-[50%] translate-y-[-50%] shadow-share_button cursor-pointer'/>

    );
  };


const SharePopup = () => {

    const description = 'This image was AI generated on Dreamscape'
    const name = 'Dreamscape'
    const [currentSlide, setCurrentSlide] = useState(0)

    var settings = {
      infinite: false,
      draggable: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
      prevArrow: <CustomPrevArrow isDisabled={currentSlide === 0}/>,
      nextArrow: <CustomNextArrow isDisabled={currentSlide === 2}/>
    };

    const dispatch = useDispatch()

    const [copy, setCopy] = useState(false)
    const { currentPost, currentImage } = useSelector((state) => state.post)

    const HandleSlideChange = (oldIndex, newIndex) =>
    {
      setCurrentSlide(newIndex)
    }

    const HandleCopy = () =>
    {
      setCopy(true)

      navigator.clipboard.writeText(currentPost).then(() =>
      {
        console.log('Copied')
      },
      (err) =>
      {
        console.log(err)
      })

      setTimeout(() =>
      {
        setCopy(false)
      }, 5000)
    }

  return (
      <div className='bg-black bg-opacity-95 fixed inset-0 flex items-center justify-center z-50'>
          <div className='hidden sm:block bg-[#222328] px-10 py-8 rounded-xl w-[90%] max-w-[32.5rem]'>
            <div className='relative flex justify-between text-[#eeeeee] mb-5'>
              <h1 className='text-[1.5rem]'>Share</h1>
              <CloseIcon sx={{ fontSize: '1.6rem'}} className='absolute right-[-1rem] text-[#eeeeee] cursor-pointer' onClick={() => dispatch(remove())}/>
            </div>
              <Slider {...settings} beforeChange={HandleSlideChange}>
                <FacebookShareButton url={currentPost} quote={description}><FacebookIcon size={60} round={true}/></FacebookShareButton>
                <TwitterShareButton url={currentPost} title={description} via={name}><TwitterIcon size={60} round={true}/></TwitterShareButton>
                <WhatsappShareButton url={currentPost} title={description}><WhatsappIcon size={60} round={true}/></WhatsappShareButton>
                <TelegramShareButton url={currentPost} title={description}><TelegramIcon size={60} round={true}/></TelegramShareButton>
                <PinterestShareButton url={currentPost} media={currentPost} description={description}><PinterestIcon size={60} round={true}/></PinterestShareButton>
                <LinkedinShareButton url={currentPost} title='Check this out!' description={description} source='https://dreamscapepro.com'><LinkedinIcon size={60} round={true}/></LinkedinShareButton>
                <EmailShareButton url={currentPost} subject='Check this out!' body={description}><EmailIcon size={60} round={true}/></EmailShareButton>
              </Slider>
              <div className='flex justify-between mt-10 border border-gray-300 rounded-lg w-full px-3 py-2'>
                <input
                  type="text"
                  value={currentPost}
                  disabled={true}
                  className='cursor-text bg-transparent border-none text-[#eeeeee] text-sm outline-none w-[75%]'
                />
                <button
                  onClick={HandleCopy}
                  className='font-inter font-medium bg-[#6f45d1] text-white text-sm px-[15px] py-[7.5px] rounded-md'
                >Copy</button>
              </div>
          </div>
          <div className='relative flex flex-col items-center sm:hidden bg-[#222328] px-10 py-6 rounded-xl w-[90%] max-w-[300px]'>
            <div className='flex justify-center text-[#eeeeee] mb-10'>
              <h1 className='text-[1.7rem]'>Share</h1>
              <CloseIcon sx={{ fontSize: '1.6rem'}} className='absolute top-8 right-[1rem] text-[#eeeeee] cursor-pointer' onClick={() => dispatch(remove())}/>
            </div>
              <div className='grid grid-cols-3 gap-x-10 gap-y-4 justify-items-center '>
                <FacebookShareButton url={currentPost} quote={description}><FacebookIcon size={60} round={true}/></FacebookShareButton>
                <TwitterShareButton url={currentPost} title={description} via={name}><TwitterIcon size={60} round={true}/></TwitterShareButton>
                <WhatsappShareButton url={currentPost} title={description}><WhatsappIcon size={60} round={true}/></WhatsappShareButton>
                <TelegramShareButton url={currentPost} title={description}><TelegramIcon size={60} round={true}/></TelegramShareButton>
                <PinterestShareButton url={currentPost} media={currentPost} description={description}><PinterestIcon size={60} round={true}/></PinterestShareButton>
                <LinkedinShareButton url={currentPost} title='Check out what I created!' description='This image was AI generated on Dreamscape' source='https://dreamscapepro.com'><LinkedinIcon size={60} round={true}/></LinkedinShareButton>
                <EmailShareButton url={currentPost} subject='Check out what I created!' body='This image was AI generated on Dreamscape'><EmailIcon size={60} round={true}/></EmailShareButton>
              </div>
                <button
                  onClick={HandleCopy}
                  className='mt-[3rem] font-inter font-medium bg-[#6f45d1] text-white px-[20px] py-[10px] rounded-md w-full'
                >Copy Link</button>
          </div>
          {copy && <div className='animate-[slide_5s_ease-in-out] absolute font-medium left-50 sm:left-[30px] bottom-[-100px] bg-[#222328] dark:bg-[#eeeeee] dark:text-[#222328] text-[#eeeeee] px-5 py-3 rounded-md'>
            Link copied to clipboard
          </div>}
      </div>
  )
}

export default SharePopup