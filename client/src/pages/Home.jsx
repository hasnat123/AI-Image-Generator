import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { Loader, Card, Form } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { newFavourites, newPosts } from '../Redux/UserSlice'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import CloseIcon from '@mui/icons-material/Close';

const RenderCards = ({ data, title, type, setEnlarge }) =>
{
    if (data?.length > 0) return data.map((post) => <Card key={post._id} {...post} type={type} setEnlarge={setEnlarge}/>)
    return (
        <h2 className='mt-5 font-bold text-[#222328] dark:text-[#eeeeee] text-xl uppercase'>
            {title}
        </h2>
    )
}

const Home = ({ type }) => {
    
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const { currentUser } = useSelector((state) => state.user)

    const [loading, setLoading] = useState(false)
    const [allPosts, setAllPosts] = useState(null)
    const [searchText, setSearchText] = useState('')
    const [searchedRes, setSearchedRes] = useState(null)
    const [searchTimeout, setSearchTimeout] = useState(null)

    const [enlarge, setEnlarge] = useState('')


    useEffect(() =>
    {
        const fetchPosts = async() =>
        {
            setLoading(true)
            try
            {
                const res = type === 'user' ? await axios.get('https://api.dreamscapepro.com/api/v1/post/user-posts', { withCredentials: true }) : type === 'favourites' ? await axios.get('https://api.dreamscapepro.com/api/v1/post/favourites', { withCredentials: true }) : await axios.get('https://api.dreamscapepro.com/api/v1/post', { withCredentials: true })

                if (res.status === 200) type === 'user' ? dispatch(newPosts(res.data.data.reverse())) : type === 'favourites' ? dispatch(newFavourites(res.data.data.reverse()))  : setAllPosts(res.data.data.reverse())
                console.log(res.data.data)
            }
            catch(err)
            {
                console.log(err.response.data.message)
            }
            finally
            {
                setLoading(false)
            }
        }
        fetchPosts()
        setSearchText('')
        
    }, [type])

    useEffect(() =>
    {
        const fetchFavourites = async() =>
        {
            try
            {
                const res = await axios.get('https://api.dreamscapepro.com/api/v1/post/favourites', { withCredentials: true })
                dispatch(newFavourites(res.data.data.reverse()))
                console.log(res.data.data)
            }
            catch(err)
            {
                console.log(err.response.data.message)
            }
        }
        
        fetchFavourites()
        
    }, [])

    const HandleSearch = (e) =>
    {
        clearTimeout(searchTimeout)

        setSearchText(e.target.value)

        setSearchTimeout(
            setTimeout(() =>
            {
                const res = type === 'user' ? currentUser.posts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase())) : type === 'favourites' ? currentUser.favourites.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase())) : allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()))
                setSearchedRes(res)
            }, 500)
        )

    }

  return (
    <HelmetProvider>
        <Helmet>
          <title>Dreamscape | {type === 'user' ? 'Gallery' : type === 'favourites' ? 'Favourites' : 'Home'}</title>
        </Helmet>
        {enlarge && (<div className='bg-black bg-opacity-95 fixed inset-0 flex items-center justify-center z-50'>
            <div className='w-[93%] max-w-[30rem] lg:max-w-[35rem] xl:max-w-[45rem] h-auto rounded-xl'>
              <CloseIcon sx={{ fontSize:  { xs: '1.85rem', sm: '2rem', md: '2.25rem' }}} className='absolute bg-[#eeeeee] top-[25px] sm:top-[30px] md:top-[40px] right-[3.5%] md:right-[40px] text-[#222328] cursor-pointer rounded-[5px]' onClick={() => setEnlarge('')}/>
              <img src={enlarge} className='w-[100%] h-auto object-cover rounded-xl'/>
            </div>
        </div>)}
        <section className='max-w-7xl mx-auto'>
            <div>
                <h1 className='font-extrabold text-[#222328] dark:text-[#eeeeee] text-[32px]'>{type === 'user' ? 'Gallery' : type === 'favourites' ? 'Favourites' : 'Community Showcase'}</h1>
                <p className='mt-2 text-[#666e75] dark:text-[#CCCCCC] text-[16px] max-w-[500px]'>{type === 'user' ? 'Your unique creations shared with the Dreamscape community' : type === 'favourites' ? 'Your favourite works of art from the Dreamscape community' : 'Discover a stunning collection of imaginative and visually stunning images generated by Dreamscape'}</p>
            </div>
            <div className='mt-16'>
                <Form
                    labelName='Search posts'
                    type='text'
                    name='text'
                    placeholder='Search...'
                    value={searchText}
                    HandleChange={HandleSearch}
                />
            </div>
            <div className='mt-10'>
                {loading ? 
                (
                    <div className='flex justify-center items-center'>
                        <Loader/>
                    </div>
                ) : 
                (
                    <>
                        {searchText &&
                        (
                            <h2 className='font-medium text-[#666e75] dark:text-[#cccccc] text-xl mb-3'>Showing results for <span className='text-[#222328] dark:text-[#eeeeee]'>{searchText}</span></h2>
                        )}
                        <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
                            {searchText ?
                            (
                                <RenderCards
                                    data={searchedRes}
                                    title="No search results found"
                                    type={type}
                                    setEnlarge={setEnlarge}
                                />
                            ) : 
                            (
                                <RenderCards
                                    data={ type === 'user' ? currentUser.posts : type === 'favourites' ? currentUser.favourites : allPosts}
                                    title="No posts found"
                                    type={type}
                                    setEnlarge={setEnlarge}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    </HelmetProvider>
  )
}

export default Home