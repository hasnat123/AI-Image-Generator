import React, { useState } from 'react'
import { download, enlargeIcon, heart, heart2, share } from '../assets'
import { downloadImage } from '../utils'
import FavoriteIcon from '@mui/icons-material/Favorite';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { favourites } from '../Redux/UserSlice';
import { fetchSuccess } from '../Redux/PostsSlice';

const Card = React.forwardRef(({ _id, name, prompt, photo, profilePic, favouritesCount, type, setEnlarge, setCurrentPost, isLoading }, ref) => {

  const [isFavouriting, setisFavouriting] = useState(false)

  const { currentUser } = useSelector((state) => state.user)

  const dispatch = useDispatch()

  // const [enlarge, setEnlarge] = useState(false)

  const HandleFavourite = async () =>
  {
    try
    {
      setisFavouriting(true)
      const res = currentUser.favourites.some(favourite => favourite._id === _id)
      ? (await axios.put('api/v1/user/unfavourite', { _id }, { withCredentials: true }))
      : (await axios.put('api/v1/user/favourite', { _id }, { withCredentials: true }))
      dispatch(favourites(res.data))
    }
    catch(err)
    {
      console.log(err.response.data.message)
    }
    finally
    {
      setisFavouriting(false)
    }
  }

  const cardBody = 
  (
    <>
        {/* <div className='group-hover:block hidden'><div className='absolute right-3 top-3 rounded-full bg-[#10131f] p-2 pl-4' onClick={HandleFavourite}><span className='text-[#eeeeee] mr-4'>444444444444</span><FavoriteIcon className='bg-white p-2 rounded-full cursor-pointer' sx={{ color: currentUser?.favourites?.some(favourite => favourite?._id === _id) ? '#6f45d1' : '', fontSize: '2.5em' }}/></div></div> */}
        <img src={photo} alt={prompt} className='w-full h-auto object-cover rounded-xl'/>
        <div className='group-hover:hidden flex-col max-h-[70%] sm:max-h-[72%] flex absolute bottom-0 left-0 right-0 bg-[#10131f] bg-opacity-90 m-2 p-3 xs:p-4 rounded-md'>
          <div className=' flex justify-between items-center gap-2'>
            <div className='flex items-center gap-2 overflow-hidden'>
            {type !== 'user' && (profilePic ?
              (<img src={profilePic} alt='User profile picture' className='w-7 h-7 rounded-full object-cover'/>) : 
              (<div className='w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold'>
                {name && name[0]}
              </div>))}
              <p className='flex-1 text-white text-sm whitespace-nowrap overflow-hidden text-ellipsis'>{(type !== 'user') && name}</p>
            </div>
            <div className='flex items-center justify-between gap-[5px] lg:gap-[7.5px]'>
              <span className='text-[#fff] text-sm'>{favouritesCount}</span>
              <button disabled={isFavouriting} type='button' onClick={HandleFavourite} className={`outline-none bg-transparent border-none`}>
                { currentUser?.favourites?.some(favourite => favourite?._id === _id) ?  <img src={heart} alt="Enlarge image" className='w-5 h-5 min-w-[24px] object-contain'/> : <img src={heart2} alt="Enlarge image" className='w-5 h-5 min-w-[24px] object-contain'/> }
              </button>
            </div>

          </div>
        </div>
        <div className='group-hover:flex flex-col max-h-[70%] sm:max-h-[72%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-3 xs:p-4 rounded-md'>
          <p className='pr-3 sm:pr-3 pb-3 scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-gray-400 scrollbar-track-gray-700 scrollbar-thumb-opacity-50 scrollbar-track-opacity-50 text-white text-md overflow-y-auto'>{prompt}</p>
          <div className='mt-2 flex justify-between items-center gap-2'>
            <div className='flex items-center gap-2 overflow-hidden'>
            {type !== 'user' && (profilePic ?
              (<img src={profilePic} alt='User profile picture' className='w-7 h-7 rounded-full object-cover'/>) : 
              (<div className='w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold'>
                {name && name[0]}
              </div>))}
              {/* <p class='absolute z-10 bottom-[-3rem] left-1/2 transform -translate-x-1/2 text-white text-sm whitespace-nowrap overflow-visible text-ellipsis hidden group-hover:block bg-black bg-opacity-90 p-2 rounded-md'>{(type !== 'user') && name}</p> */}
              <p className='flex-1 text-white text-sm whitespace-nowrap overflow-hidden text-ellipsis'>{(type !== 'user') && name}</p>

            </div>
            <div className='flex items-center justify-between gap-[5px]'>
              <button type='button' onClick={() => downloadImage(_id, photo)} className='outline-none bg-transparent border-none'>
                <img src={download} alt="Download image" className='w-5 h-5 min-w-[24px] object-contain invert'/>
              </button>
              <button type='button' onClick={() => dispatch(fetchSuccess([`https://dreamscapepro.com/post/${_id}`, photo]))} className='outline-none bg-transparent border-none'>
                <img src={share} alt="Share image" className='w-5 h-5 min-w-[24px] object-contain invert'/>
              </button>
              <button type='button' onClick={() => setEnlarge(photo)} className='hidden xs:block outline-none bg-transparent border-none'>
                <img src={enlargeIcon} alt="Enlarge image" className='w-5 h-5 min-w-[24px] object-contain invert'/>
              </button>
              <button disabled={isFavouriting} type='button' onClick={HandleFavourite} className='outline-none bg-transparent border-none'>
                { currentUser?.favourites?.some(favourite => favourite?._id === _id) ?  <img src={heart} alt="Enlarge image" className='w-5 h-5 min-w-[24px] object-contain'/> : <img src={heart2} alt="Enlarge image" className='w-5 h-5 min-w-[24px] object-contain'/> }
              </button>
            </div>

          </div>
        </div>
    </>
  )

  const content = ref
  ? <div ref={ref} className ='rounded-xl group relative z-0 shadow-card dark:shadow-card_dark hover:shadow-cardhover dark:hover:shadow-cardhover_dark card'>{cardBody}</div>
  : <div className ='rounded-xl group relative z-0 shadow-card dark:shadow-card_dark hover:shadow-cardhover dark:hover:shadow-cardhover_dark card'>{cardBody}</div>

  return content
})

export default Card