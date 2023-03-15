import axios from 'axios'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Link, Routes, Route, Navigate } from 'react-router-dom'

import FavoriteIcon from '@mui/icons-material/Favorite';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ImageIcon from '@mui/icons-material/Image';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import AddBoxIcon from '@mui/icons-material/AddBox';

import { logoDark } from './assets'
import { logoLight } from './assets'
import { CreatePost, Home } from './pages'
import Signin from './pages/Signin'
import { logout } from './Redux/UserSlice'
import ChangeProfilePic from './pages/ChangeProfilePic';
import ErrorPage from './pages/ErrorPage';
import EmailVerification from './pages/EmailVerification';

const App = () => {

  const [isDark, setIsDark] = useState(true)
  const [open, setOpen] = useState(false)

  const userMenuRef = useRef(null);
  const picRef = useRef(null);
  const iconRef = useRef(null);

  const dispatch = useDispatch()
  const { currentUser } = useSelector(state => state.user)

  const HandleToggle = (event) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setOpen(false);
    }

    if ((picRef.current && picRef.current.contains(event.target)) || (iconRef.current && iconRef.current.contains(event.target))) setOpen(!open)
  };

  const HandleLogout = async (e) =>
  {
    e.preventDefault()

    try
    {
      const res = await axios.post('http://localhost:8080/api/v1/auth/logout', null, { withCredentials: true })
      console.log(res.data)
      setOpen(false)
      dispatch(logout())
    }
    catch(err)
    {
      console.log(err)
    }
  }

  return (
    <BrowserRouter>
      <div className={`scrollbar-thin scrollbar-thumb-black scrollbar-track-black ${isDark ? 'dark' : ''}`}>
        <header className='bg-[#fff] dark:bg-[#202124] w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebff4] dark:border-b-[#3C4043]' onClick={HandleToggle}>
          <Link to='/'>
            {isDark ? (<img src={logoDark} alt="logo" className='w-[3.5em] sm:w-[75px] object-contain'/>) : (<img src={logoLight} alt="logo" className='w-[3.5em] sm:w-[75px] object-contain'/>)}
          </Link>
          <div className='flex items-center'>
            {isDark ? (<button onClick={() => setIsDark(!isDark)} title="Switch to light mode" className={`${currentUser ? 'hidden' : ''} sm:block relative w-10 h-10 focus:outline-none focus:shadow-outline text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mr-[0.5vw]`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-sun" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"></path>
              </svg>
            </button>) :
            (<button onClick={() => setIsDark(!isDark)} title="Switch to dark mode" className={`${currentUser ? 'hidden' : ''} sm:block relative w-10 h-10 focus:outline-none focus:shadow-outline text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mr-[0.5vw]`}>
              <svg style={{width:'24px', height:'24px'}} viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" />
              </svg>
            </button>)}
            {currentUser && <Link to='/create' className='hidden sm:block font-inter font-medium bg-[#6f45d1] text-white px-4 py-2 rounded-md'>
              Create
            </Link>}
            

            
            {currentUser && <div className='px-2 sm:hidden text-[#222328] dark:text-[#eeeeee] font-bold cursor-pointer'>
              <MenuIcon ref={iconRef} id='menu-icon' sx={{fontSize: '2.5rem'}} onClick={HandleToggle}/>
            </div>}
            <div ref={picRef} className='hidden sm:block px-4'>
              {currentUser && (currentUser.image ?
                (<img src={currentUser.image} alt="profile-pic" className='w-10 h-10 rounded-full cursor-pointer' id='profile-pic' onClick={HandleToggle}/>) :
              
                (<div className='w-10 h-10 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold capitalize cursor-pointer' id='profile-pic' onClick={HandleToggle}>
                  {currentUser.username[0]}
                </div>)
              )}
            </div>
            {(currentUser && open) &&
            (<ul ref={userMenuRef} id='user-menu' className='user_menu absolute z-10 w-60 py-[1rem] bg-[#fff] dark:bg-[#2a2b2e] shadow-user_menu text-[#222328] dark:text-[#ffffff] top-[5rem] sm:top-[6rem] right-[1rem] sm:right-[1.5rem] rounded-xl'>
                <li className='profile_details flex justify-between mb-2 pb-4 px-3.5 border-b border-b-[#e6ebff4] dark:border-b-[#4b4f52]'>
                  <div className='flex items-center whitespace-nowrap overflow-hidden '>
                    {currentUser && (currentUser.image ? (currentUser.fromGoogle ?
                      (<div>
                        <img src={currentUser.image} alt="profile-pic" className='w-10 h-10 rounded-full'/>
                      </div>) :
                      (<Link to='/change-profile-pic'><div title='Change' className='group cursor-pointer' onClick={() => setOpen(false)}>
                        <EditIcon className='group-hover:scale-[1.15] group-hover:transition absolute top-[2.6rem] left-[0.9rem] bg-[#222328] dark:bg-[#eeeeee] rounded-full text-[#eeeeee] p-[0.2rem] dark:text-[#222328]' sx={{fontSize: '1rem'}}/>
                        <img src={currentUser.image} alt="profile-pic" className='w-10 h-10 rounded-full'/>
                      </div></Link>)) :
                    
                      (<Link to='/change-profile-pic'><div title='Change' className='group w-10 h-10 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold capitalize' onClick={() => setOpen(false)}>
                        <EditIcon className='group-hover:scale-[1.15] group-hover:transition absolute top-[2.6rem] left-[0.9rem] bg-[#222328] dark:bg-[#eeeeee] rounded-full text-[#eeeeee] p-[0.2rem] dark:text-[#222328]' sx={{fontSize: '1rem'}}/>
                        {currentUser.username[0]}
                      </div></Link>)
                    )}
                    
                    <div title={currentUser.username} className='flex-1 ml-3.5 font-inter font-medium text-lg whitespace-nowrap overflow-hidden text-ellipsis'>{currentUser.username}</div>
                  </div>
                </li>
                <li onClick={() => setOpen(false)}><Link to='/create' className='flex sm:hidden justify-between items-center py-3 px-3.5 bg-[#6f45d1] text-[#fff]'><div className='flex items-center'><span className='mr-[1rem]'><AddBoxIcon/></span><span>Create</span></div></Link></li>
                <li onClick={() => setOpen(false)}><Link to='/gallery' className='flex justify-between items-center py-3 px-3.5 hover:bg-[#f2f2f2] dark:hover:bg-[#424346] cursor-pointer'><div className='flex items-center'><span className='mr-[1rem]'><ImageIcon/></span><span>Gallery</span></div><span><KeyboardArrowRightIcon/></span></Link></li>
                <li onClick={() => setOpen(false)}><Link to='/favourites' className='flex justify-between items-center py-3 px-3.5 hover:bg-[#f2f2f2] dark:hover:bg-[#424346] cursor-pointer'><div className='flex items-center'><span className='mr-[1rem]'><FavoriteIcon /></span><span>Favourites</span></div><span><KeyboardArrowRightIcon/></span></Link></li>
                <li onClick={() => {setIsDark(!isDark); setOpen(false)}} className='flex sm:hidden justify-between items-center py-3 px-3.5 hover:bg-[#f2f2f2] dark:hover:bg-[#424346] cursor-pointer'>
                  <div className='flex items-center'>
                    {isDark ?
                      (<button title="Switch to light mode" className="focus:outline-none focus:shadow-outline mr-[1rem]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-sun" width="24" height="25.65" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <circle cx="12" cy="12" r="4"></circle>
                          <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"></path>
                        </svg>
                      </button>) :
                      (<button title="Switch to dark mode" className="focus:outline-none focus:shadow-outline mr-[1rem]">
                        <svg style={{width:'24px', height:'25.65px'}} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" />
                        </svg>
                      </button>
                    )}
                    <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
                  </div>
                </li>
                <li className='flex justify-between items-center py-3 px-3.5 hover:bg-[#f2f2f2] dark:hover:bg-[#424346] cursor-pointer' onClick={HandleLogout}><div className='flex items-center'><span className='mr-[1rem]'><ExitToAppIcon/></span><span>Logout</span></div></li>
            </ul>)}
          </div>
        </header>
        <main className='relative sm:p-8 sm:pb-[6rem] px-4 py-8 pb-[3rem] w-full bg-[#fff] dark:bg-[#202124] min-h-[calc(100vh-73px)]' onClick={HandleToggle}>
          <Routes>
            <Route path='/signin' element={!currentUser ? <Signin/> : <Navigate to='/'/>}/>
            <Route path='/' element={currentUser ? <Home type=''/> : <Navigate to='/signin'/>}/>
            <Route path='/create' element={currentUser ? <CreatePost/> : <Navigate to='/signin'/>}/>
            <Route path='/favourites' element={currentUser ? <Home type={'favourites'}/> : <Navigate to='/signin'/>}/>
            <Route path='/gallery' element={currentUser ? <Home type={'user'}/> : <Navigate to='/signin'/>}/>
            <Route path='/change-profile-pic' element={currentUser ? (!currentUser.fromGoogle ? <ChangeProfilePic/> : <Navigate to='/'/>)  : <Navigate to='/signin'/>}/>
            <Route path='/users/:id/verify/:token' element={<EmailVerification/>}/>
            <Route path='/*' element={<ErrorPage/>}/>
          </Routes>
        </main>
        <footer className='bg-[#fff] dark:bg-[#202124] text-[#222328] text-[0.9em] sm:text-[1em] text-center dark:text-[#eeeeee] w-full py-[2rem] sm:py-[5rem] flex justify-center items-center sm:px-8 px-4 py-4 border-t border-t-[#e6ebff4] dark:border-t-[#3C4043]'>
          Copyright © 2023 Dreamscape All rights reserved.
        </footer>
      </div>

    </BrowserRouter>
  )
}

export default App