import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../components';
import { downloadImage } from '../utils';
import { download, enlargeIcon, heart, heart2, share } from '../assets'
import { useDispatch, useSelector } from 'react-redux';
import { favourites } from '../Redux/UserSlice';
import { fetchSuccess, remove } from '../Redux/PostsSlice';
import SharePopup from '../components/SharePopup';

const Post = () => {

    const { currentUser } = useSelector((state) => state.user)
    const { currentPost } = useSelector((state) => state.post)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { id } = useParams();
    const [post, setPost] = useState(null)

    const HandleFavourite = async () =>
    {
      try
      {
        if (currentUser)
        {
          const res = currentUser.favourites.some(favourite => favourite._id === post._id)
          ? (await axios.put('api/v1/user/unfavourite', { _id: post._id }, { withCredentials: true }))
          : (await axios.put('api/v1/user/favourite', { _id: post._id }, { withCredentials: true }))
          dispatch(favourites(res.data))
        }
        else navigate('/signin')

      }
      catch(err)
      {
        console.log(err)
      }
    }

    useEffect(() =>
    {
        const fetchPost = async() =>
        {
            try
            {
                const res = await axios.get(`api/v1/post/find/${id}`, { withCredentials: true })
                // dispatch(newFavourites(res.data.data.reverse()))
                setPost(res.data.data)
                dispatch(remove())
            }
            catch(err)
            {
                console.log(err.response.data.message)
            }
        }
        
        fetchPost()
        
    }, [id])

  return (
    <div className='flex h-[60vh] xs:h-auto my-10 justify-center items-center'>
        {post &&
            <div className ='w-[95%] max-w-[50rem] rounded-xl group relative z-0'>
              {currentPost && <SharePopup />}
              <img src={post.photo} alt={post.prompt} className='w-full h-auto object-cover rounded-xl'/>
              <div className='flex-col flex absolute bottom-0 left-0 right-0 bg-[#10131f] bg-opacity-90 group-hover:bg-opacity-100 m-2 p-3 xs:p-4 rounded-md'>
                <div className=' flex justify-between items-center gap-2'>
                  <div className='flex items-center gap-2 overflow-hidden'>
                  {post.profilePic ?
                    (<img src={post.profilePic} alt='User profile picture' className='w-7 h-7 rounded-full object-cover'/>) : 
                    (<div className='w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold'>
                      {post.name && post.name[0]}
                    </div>)}
                    <p className='flex-1 text-white text-sm whitespace-nowrap overflow-hidden text-ellipsis'>{post.name}</p>
                  </div>
                  <div className='flex flex-row-reverse items-center justify-between gap-[5px] lg:gap-[7.5px]'>
                    <button type='button' onClick={HandleFavourite} className='outline-none bg-transparent border-none'>
                      { currentUser?.favourites?.some(favourite => favourite?._id === post._id) ?  <img src={heart} alt="Enlarge image" className='w-5 h-5 min-w-[24px] object-contain'/> : <img src={heart2} alt="Enlarge image" className='w-5 h-5 min-w-[24px] object-contain'/> }
                    </button>
                    <span className='inline-block group-hover:hidden text-[#fff] text-sm'>{post.favouritesCount}</span>
                    <button type='button' onClick={() => dispatch(fetchSuccess(`http://localhost:5173/post/${post._id}`))} className='outline-none bg-transparent border-none'>
                      <img src={share} alt="Share image" className='hidden group-hover:block w-5 h-5 min-w-[24px] object-contain invert'/>
                    </button>
                    <button type='button' onClick={() => downloadImage(post._id, post.photo)} className='outline-none bg-transparent border-none'>
                      <img src={download} alt="Download image" className='hidden group-hover:block w-5 h-5 min-w-[24px] object-contain invert'/>
                    </button>

                  </div>
                </div>
              </div>
            </div>
        }
    </div>
  )
}

export default Post