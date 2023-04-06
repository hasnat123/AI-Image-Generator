import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader, Card, Form } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { newFavourites, newPosts } from '../Redux/UserSlice'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import CloseIcon from '@mui/icons-material/Close';
import SharePopup from '../components/SharePopup'
import { remove } from '../Redux/PostsSlice'
import usePosts from '../hooks/usePosts'

const RenderCards = ({ data, title, type, setEnlarge, lastPostRef }) => {
    if (data?.length > 0)
      return data?.map((post, i) => (
        <Card
          key={post?._id}
          {...post}
          type={type}
          setEnlarge={setEnlarge}
          ref={data.length === i + 1 ? lastPostRef : null}
        />
      ));
    return (
      <h2 className="mt-5 font-bold text-[#222328] dark:text-[#eeeeee] text-xl uppercase">{title}</h2>
    );
};

const Home = ({ type }) => {
    
    const [searchText, setSearchText] = useState('')
    const [pageNum, setPageNum] = useState(1)
    const [baseUrl, setBaseUrl] = useState(() => {
        if (type === 'user') return 'user-posts';
        if (type === 'favourites') return 'favourites';
        return '';})

    const { isLoading, isError, error, results, hasNextPage } = usePosts(pageNum, baseUrl, searchText)
    
    const intObserver = useRef()
    const lastPostRef = useCallback(post =>
    {
        if (isLoading) return

        if(intObserver.current) intObserver.current.disconnect()

        intObserver.current = new IntersectionObserver(posts =>
        {
            if (posts[0].isIntersecting && hasNextPage)
            {
                setPageNum(prev => prev + 1)
            }
        })
        
        if (post) intObserver.current.observe(post)



    }, [isLoading, hasNextPage, type])

    const navigate = useNavigate()

    const dispatch = useDispatch()
    const { currentUser } = useSelector((state) => state.user)
    const { currentPost } = useSelector((state) => state.post)

    const [loading, setLoading] = useState(false)
    const [allPosts, setAllPosts] = useState(null)
    const [searchedRes, setSearchedRes] = useState(null)
    const [searchTimeout, setSearchTimeout] = useState(null)

    const [enlarge, setEnlarge] = useState('')

    // useEffect(() =>
    // {
    //     const fetchPosts = async() =>
    //     {
    //         setLoading(true)
    //         try
    //         {
    //             const res = type === 'user' ? await axios.get('api/v1/post/user-posts', { withCredentials: true }) : type === 'favourites' ? await axios.get('api/v1/post/favourites', { withCredentials: true }) : await axios.get('api/v1/post', { withCredentials: true })

    //             if (res.status === 200) type === 'user' ? dispatch(newPosts(res.data.data.reverse())) : type === 'favourites' ? dispatch(newFavourites(res.data.data.reverse()))  : setAllPosts(res.data.data)
    //             dispatch(remove())

    //         }
    //         catch(err)
    //         {
    //             console.log(err.response.data.message)
    //         }
    //         finally
    //         {
    //             setLoading(false)
    //         }
    //     }
    //     fetchPosts()
    //     setSearchText('')
    // }, [type])

    // useEffect(() =>
    // {
    //     const fetchFavourites = async() =>
    //     {
    //         try
    //         {
    //             const res = await axios.get('api/v1/post/favourites', { withCredentials: true })
    //             dispatch(newFavourites(res.data.data.reverse()))
    //         }
    //         catch(err)
    //         {
    //             console.log(err.response.data.message)
    //         }
    //     }
        
    //     fetchFavourites()
        
    // }, [])

    useEffect(() => {
        setPageNum(1);
        setBaseUrl(() => {
          if (type === 'user') return 'user-posts';
          if (type === 'favourites') return 'favourites';
          return '';
        });
        dispatch(remove())
        setSearchText('')
      }, [type]);

      useEffect(() => {
        setPageNum(1);

      }, [searchText]);

      useEffect(() => {
        if(type === 'favourites') dispatch(newFavourites(results))
      }, [results]);

    const HandleSearch = (e) =>
    {
        clearTimeout(searchTimeout)

        setSearchText(e.target.value)

        setSearchTimeout(
            setTimeout(() =>
            {
                // const res = type === 'favourites' ? currentUser.favourites.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase())) : results.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()))
                // setSearchedRes(res)

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
        {currentPost && <SharePopup />}
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

                {(isLoading && pageNum === 1) ?
                    <div className='flex justify-center items-center'>
                        <Loader/>
                    </div>
                    :(<>
                        {searchText &&
                        (
                            <h2 className='font-medium text-[#666e75] dark:text-[#cccccc] text-xl mb-3'>Showing results for <span className='text-[#222328] dark:text-[#eeeeee]'>{searchText}</span></h2>
                        )}
                        <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
     
                                <RenderCards
                                    // data={ type === 'favourites' ? currentUser.favourites : results}
                                    data={results}
                                    title="No posts found"
                                    type={type}
                                    setEnlarge={setEnlarge}
                                    lastPostRef={lastPostRef}
                                />
                        </div>
                    </>)
                }

                {(isLoading && pageNum > 1) &&
                (
                    <div className='mt-10 flex justify-center items-center'>
                        <Loader/>
                    </div>
                )}
            </div>
        </section>
    </HelmetProvider>
  )
}

export default Home