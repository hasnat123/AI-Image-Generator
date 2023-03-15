import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import PauseCircleOutlinedIcon from "@mui/icons-material/PauseCircleOutlined";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject  } from "firebase/storage";
import app from './../Firebase'
import { changePic, newFavourites } from '../Redux/UserSlice';
import { useDispatch, useSelector } from 'react-redux';


const ChangeProfilePic = () => {

    const navigate = useNavigate()

    const { currentUser } = useSelector(state => state.user)

    const [image, setImage] = useState('')

    const [uploadDetails, setUploadDetails] = useState({

        imageFile: null,
        storageRef: null,
        uploadTask: null,
        uploadComplete: false,
        percentage: 0,
        pause: false
    })

    const [isUploading, setIsUploading] = useState(false)

    const dispatch = useDispatch()


    const HandleUploadProcess = (process) =>
    {
        if (uploadDetails.uploadTask)
        {
            switch(process)
            {
                case 'CANCEL':
                    uploadDetails.uploadTask.cancel()
                    setUploadDetails(prev => {return {...prev, uploadTask: null, percentage: 0, pause: false}})
    
                    if (uploadDetails.uploadComplete)
                    {
                        deleteObject(uploadDetails.storageRef).then(() => {
                            setUploadDetails(prev => {return {...prev, storageRef: null, uploadComplete: false}})
                          }).catch((error) => {
                            console.log(error)
                          });
                    }
                    console.log('upload cancelled')
                    break;
                case 'PAUSE':
                    uploadDetails.uploadTask.pause()
                    setUploadDetails(prev => {return {...prev, pause: true}})
                    console.log('upload paused')
                    break;
                case 'RESUME':
                    uploadDetails.uploadTask.resume()
                    setUploadDetails(prev => {return {...prev, pause: false}})
                    console.log('upload resumed')
                    break;
                default:
                    break;
            }
        }
    }

    const HandleClose = () =>
    {
        HandleUploadProcess('CANCEL')
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();
      
        // Compare current image to user's current profile picture
        if (image === currentUser.image) {
          console.log("Image has not changed, no need to upload");
          return;
        }
      
        setIsUploading(true);
      
        try {
          const storage = getStorage(app);
      
        //   const fileName = new Date().getTime() + uploadDetails.imageFile.name;
        const fileName = `${currentUser._id}-profile-pic`;
      
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, uploadDetails.imageFile);
      
          setUploadDetails((prev) => {
            return { ...prev, storageRef, uploadTask };
          });
      
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadDetails((prev) => {
                return { ...prev, percentage: Math.round(progress) };
              });
            },
            (error) => {
              console.log(error);
              setIsUploading(false);
            },
            () => {
              // Upload completed successfully, now we can get the download URL
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImage(downloadURL);
                setUploadDetails((prev) => {
                  return { ...prev, uploadComplete: true };
                });
                setIsUploading(false);
      
                // Update user's profile picture in the backend
                axios
                  .put(
                    `http://localhost:8080/api/v1/user`,
                    { image: downloadURL },
                    { withCredentials: true }
                  )
                  .then((res) => {
                    dispatch(changePic(downloadURL));
                    navigate('/')
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });
            }
          );
        } catch (error) {
          console.log(error);
          setIsUploading(false);
        }
      };

    // useEffect(() =>
    // {
    //     uploadDetails.imageFile && HandleUploadFile(uploadDetails.imageFile)
    // }, [uploadDetails.imageFile])

  return (
        <div className='m-auto mt-[7vh] flex items-center border-[2px] dark:border-[#eeeeee] border-[#222328] rounded-xl flex-col gap-[50px] p-[1rem] sm:p-[3rem] md:p-[5rem] sm:w-[97%] md:w-[700px]'>
            <h1 className='font-extrabold text-center text-[#222328] dark:text-[#eeeeee] text-[1.75rem] sm:text-[32px]'>Change Profile Picture</h1>
            {(uploadDetails.percentage === 100) ? <h2 className='text-[#222328] dark:text-[#eeeeee] text-[20px]'>Uploaded</h2> : (uploadDetails.percentage > 0) ?
            (<div className='relative flex flex-col gap-[10px] w-[100%] max-w-[20rem] sm:max-w-[30rem]'>
                <div className='flex flex-col sm:flex-row m-auto items-center w-[100%] h-[5rem] sm:h-[3rem]'>
                    <div className='flex-[9] w-[100%] h-[100%] py-[0.3rem] px-[0.3rem] border-[2px] border-[#222328] dark:border-[#eeeeee] rounded-lg'>
                        <div className='h-[100%] bg-[#222328] dark:bg-[#eeeeee] rounded-md' style={{width: `${uploadDetails.percentage}%`}}></div>
                    </div>
                    <span className='flex flex-[1] mt-3 sm:mt-0 ml-0 sm:ml-3.5 justify-center font-semibold text-[1.1em] sm:text-[1.2em] dark:text-[#eeeeee] text-[#222328]'>{uploadDetails.percentage}%</span>
                </div>
                <div className='absolute bottom-1 sm:bottom-0 sm:relative flex '>{!uploadDetails.pause ?
                    <PauseCircleOutlinedIcon className='dark:text-[#eeeeee] text-[#222328] text-[1.1em] sm:text-[1.2em]' onClick={() => HandleUploadProcess('PAUSE')}/> : <PlayCircleOutlinedIcon className='text-[1.1em] sm:text-[1.2em] dark:text-[#eeeeee] text-[#222328]' onClick={() => HandleUploadProcess('RESUME')}/>}
                    <HighlightOffIcon className='text-[1.1em] sm:text-[1.2em] dark:text-[#eeeeee] text-[#222328]' onClick={() => HandleUploadProcess('CANCEL')}/>
                </div>
            </div>) : 

            (<input className='w-[100%] max-w-[23rem] text-center text-[#222328] dark:text-[#eeeeee] border-[1px] border-[#222328] dark:border-[#eeeeee] rounded-lg p-[10px]' type='file' accept='image/*' onChange={e => setUploadDetails(prev => {return {...prev, imageFile: e.target.files[0]}})}/>)}
            <button className='max-w-[10rem] sm:max-w-none m-auto text-white bg-[#6f45d1] font-medium rounded-md text-md w-full sm:w-auto px-5 py-2.5 sm:px-7 sm:py-3.5 text-center' disabled={ false } onClick={HandleSubmit}>{isUploading ? 'Uploading...' : 'Upload'}</button>
        </div>
  )
}

export default ChangeProfilePic