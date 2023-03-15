import React from 'react'
import { download } from '../assets'
import { downloadImage } from '../utils'
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { favourites } from '../Redux/UserSlice';

const Card = ({ _id, name, prompt, photo, profilePic, type }) => {

  const { currentUser } = useSelector((state) => state.user)

  const dispatch = useDispatch()

  const HandleFavourite = async () =>
  {
    try
    {
      const res = currentUser.favourites.some(favourite => favourite._id === _id)
        ? (await axios.put('http://localhost:8080/api/v1/user/unfavourite', { _id }, { withCredentials: true }))
        : (await axios.put('http://localhost:8080/api/v1/user/favourite', { _id }, { withCredentials: true }))
      dispatch(favourites(res.data))
      console.log(res.data)
    }
    catch(err)
    {
      console.log(err.response.data.message)
    }
  }

  return (
    <div className ='rounded-xl group relative z-0 shadow-card dark:shadow-card_dark hover:shadow-cardhover dark:hover:shadow-cardhover_dark card'>
      {/* {currentUser?.favourites?.some(favourite => favourite?._id === _id) ? <FavoriteIcon className='group-hover:block hidden absolute right-3 top-3 bg-white p-2 rounded-full cursor-pointer' onClick={HandleFavourite} sx={{ color: '#db1e1e', fontSize: '2.5em' }}/> : (<FavoriteIcon className='group-hover:block hidden absolute right-3 top-3 bg-white p-2 rounded-full cursor-pointer' onClick={HandleFavourite} sx={{fontSize: '2.5em' }}/>)} */}
      <div className='group-hover:block hidden'><FavoriteIcon className='absolute right-3 top-3 bg-white p-2 rounded-full cursor-pointer' onClick={HandleFavourite} sx={{ color: currentUser?.favourites?.some(favourite => favourite?._id === _id) ? '#6f45d1' : '', fontSize: '2.5em' }}/></div>
      <img src={photo} alt={prompt} className='w-full h-auto object-cover rounded-xl'/>
      <div className='group-hover:flex flex-col max-h-[70%] sm:max-h-[75%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md'>
        <p className='pr-3 sm:pr-3 pb-3 scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-gray-400 scrollbar-track-gray-700 scrollbar-thumb-opacity-50 scrollbar-track-opacity-50 text-white text-md overflow-y-auto'>{prompt}</p>
        <div className='mt-2 flex justify-between items-center gap-2'>
          <div className='flex items-center gap-2 overflow-hidden'>
          {type !== 'user' && (profilePic ?
            (<img src={profilePic} className='w-7 h-7 rounded-full object-cover'/>) : 
            (<div className='w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold'>
              {name && name[0]}
            </div>))}
            <p className='flex-1 text-white text-sm whitespace-nowrap overflow-hidden text-ellipsis'>{(type !== 'user') && name}</p>
          </div>
          <button type='button' onClick={() => downloadImage(_id, photo)} className='outline-none bg-transparent border-none'>
            <img src={download} alt="download" className='w-6 h-6 min-w-[24px] object-contain invert'/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card