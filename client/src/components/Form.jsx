import React from 'react'

let counter = 0;

const Form = ({ labelName, type, name, value, placeholder, HandleChange, isSurpriseMe, HandleSurpriseMe }) => {
  
  const id = `${name}-${counter++}`;

  return (
    <div>
      <div className='flex items-center gap-2 mb-2'>
        <label htmlFor={name} className='block text-sm font-medium text-gray-900 dark:text-[#CCCCCC]'>
          {labelName}
        </label>
        {isSurpriseMe && 
        (
          <button
            type='button'
            onClick={HandleSurpriseMe}
            className='font-semibold text-xs bg-[#ECECF1] dark:bg-[#000000] py-1 px-2 rounded-[5px] text-black dark:text-[#ffffff]'
          >Surprise me!</button>
        )}
      </div>
      <input
        type={type}
        required={true}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={HandleChange}
        className='bg-transparent border border-gray-300 text-gray-900 dark:text-[#eeeeee] dark:placeholder-[#b9b9b9] text-sm rounded-lg focus:ring-[#6469f] focus:border-[#6f45d1] outline-none block w-full p-3'
      />
    </div>
  )
}

export default Form