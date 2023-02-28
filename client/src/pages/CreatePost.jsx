import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Loader } from '../components'
import { preview } from '../assets'
import { getRandomPrompt } from '../utils'

const CreatePost = () => {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: ''
  })

  const [generatingImage, setGeneratingImage] = useState(false)
  const [loading, setLoading] = useState(false)

  const HandleSubmit = async (e) =>
  {
    e.preventDefault()

    if (form.prompt && form.photo)
    {
      setLoading(true)

      try {
        const res = await fetch('http://localhost:8080/api/v1/post',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({...form})
        })

        await res.json()
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
    console.log(e.target.value)
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
      try
      {
        setGeneratingImage(true)
        const res = await fetch('http://localhost:8080/api/v1/dalle',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: form.prompt })
        })

        const data = await res.json()
        setForm({...form, photo: `data:image/jpeg;base64,${data.photo}`})
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
      alert('Please enter a prompt')
    }
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>Create imaginative and visually stunning images</p>
      </div>

      <form action="submit" className='mt-16 max-w-3xl' onSubmit={HandleSubmit}>
        <div className='flex flex-col gap-5'>
          <Form
            labelName='Your name'
            type='text'
            name='name'
            placeholder='Hasnat'
            value={form.name}
            HandleChange={HandleChange}
          />
          <Form
            labelName='Promp'
            type='text'
            name='prompt'
            placeholder='3D render of a cute tropical fish in an aquarium on a dark blue background, digital art'
            value={form.prompt}
            HandleChange={HandleChange}
            isSurpriseMe
            HandleSurpriseMe={HandleSurpriseMe}
          />

          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
            {form.photo ?
            (
              <img src={form.photo} alt={form.prompt} className='w-full h-full object-contain' />
            ) :
            (
              <img src={preview} alt="preview" className='w-9/12 h-9/12 object-contain opacity-40'/>
            )}


            {generatingImage &&
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0, 0, 0, 0.5)] rounded-lg'>
                <Loader/>
              </div>
            }
          </div>
        </div>
        <div className='mt-5 flex gap-5'>
            <button type='button' onClick={HandleGenerate} className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
              {generatingImage ? 'Generating...' : 'Generate'}
            </button>
        </div>
        <div className='mt-10'>
          <p className='mt-2 text-[#666e75] text-[14px]'>Once you have created the image if you want you can share with the community</p>
            <button type='submit' className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
              {loading ? 'Sharing...' : 'Share with community'}
            </button>
        </div>
      </form>
    </section>
  )
}

export default CreatePost