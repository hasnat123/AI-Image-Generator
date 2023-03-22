import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Loader } from '../components'
import { preview } from '../assets'
import { getRandomPrompt } from '../utils'
import axios from 'axios'
import { Helmet, HelmetProvider } from "react-helmet-async";

const CreatePost = () => {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    // name: '',
    prompt: '',
    photo: ''
  })

  const [generatingImage, setGeneratingImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const HandleSubmit = async (e) =>
  {
    e.preventDefault()

    if (form.prompt && form.photo)
    {
      setLoading(true)

      try {
        const res = await axios.post('https://api.dreamscapepro.com/api/v1/post', {...form}, { withCredentials: true })
        navigate('/')
      }
      catch (error)
      {
        alert(error)
      }
      finally
      {
        setLoading(false)
      }
    }
    else alert('Please enter a prompt and generate an image')
  }

  const HandleChange = (e) =>
  {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const HandleSurpriseMe = () =>
  {
    const randomPrompt = getRandomPrompt(form.prompt)
    setForm({...form, prompt: randomPrompt})
  }

  const HandleGenerate = async () =>
  {
    if (form.prompt)
    {
      setError(false)
      try
      {
        setGeneratingImage(true)
        const res = await axios.post('https://api.dreamscapepro.com/api/v1/dalle', { prompt: form.prompt }, { withCredentials: true })
        setForm({...form, photo: `data:image/jpeg;base64,${res.data.photo}`})
      }
      catch (err)
      {
        alert(err)
      }
      finally
      {
        setGeneratingImage(false)
      }
    }
    else 
    {
      setError(true)
    }
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>Dreamscape | Create</title>
      </Helmet>
      <section className='max-w-7xl mx-auto'>
        <div>
          <h1 className='font-extrabold text-[#222328] dark:text-[#dbdddf] text-[32px]'>Create</h1>
          <p className='mt-2 text-[#666e75] text-[16px] dark:text-[#c2c4c7] max-w-[500px]'>Bring your imagination to life! Create your personal masterpieces and share them with the community</p>
        </div>

        <form action="submit" className='mt-16 max-w-3xl' onSubmit={HandleSubmit}>
          <div className='flex flex-col gap-5'>
            {/* <Form
              labelName='Your name'
              type='text'
              name='name'
              placeholder='Hasnat'
              value={form.name}
              HandleChange={HandleChange}
            /> */}
            <Form
              labelName='Prompt'
              type='text'
              name='prompt'
              placeholder='3D render of a cute tropical fish in an aquarium on a dark blue background, digital art'
              value={form.prompt}
              HandleChange={HandleChange}
              isSurpriseMe
              HandleSurpriseMe={HandleSurpriseMe}
            />

            <div className='relative aspect-square xs:max-w-[25rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 flex justify-center items-center'>
              {form.photo ?
              (
                <img src={form.photo} alt={form.prompt} className='w-full h-full object-contain' />
              ) :
              (
                <img src={preview} alt="Preview image" className='w-9/12 h-9/12 object-contain opacity-40'/>
              )}


              {generatingImage &&
                <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0, 0, 0, 0.5)] rounded-lg'>
                  <Loader/>
                </div>
              }
            </div>
          </div>
            
          {error && <p className='mt-5 text-[#eeeeee]'>You must enter a prompt</p>}

          <div className='mt-5 flex gap-5'>
              <button disabled={(generatingImage || loading) ? true : false} type='button' onClick={HandleGenerate} className={`${(generatingImage || loading) ? 'cursor-not-allowed bg-green-600' : 'bg-green-700'} text-white font-medium rounded-md text-sm w-full xs:w-auto px-5 py-2.5 text-center`}>
                {generatingImage ? 'Generating...' : 'Generate'}
              </button>
          </div>
          <div className='mt-10'>
            <p className='mt-2 text-[#666e75] dark:text-[#c2c4c7] text-[14px]'>Your image will be saved to your gallery when you share it with the community.</p>
              <button disabled={(generatingImage || loading) ? true : false} type='submit' className={`${(generatingImage || loading) ? 'cursor-not-allowed bg-[#7551ca]' : 'bg-[#6f45d1]'} mt-3 text-white font-medium rounded-md text-sm w-full xs:w-auto px-5 py-2.5 text-center`}>
                {loading ? 'Sharing...' : 'Share with community'}
              </button>
          </div>
        </form>
      </section>
    </HelmetProvider>

  )
}

export default CreatePost