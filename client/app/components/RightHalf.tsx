import React from 'react'

const AUTHOR_NAME = process.env.NEXT_PUBLIC_AUTHOR; //assignment had it italicized?

const RightHalf = () => {
  return (

    <div className="flex flex-col items-center justify-center flex-1 bg-white">
      
        <div className='text-start'>
            <h1 className="font-bold text-xl mb-1">Surge SE Internship</h1>
            <p className="text-gray-500 mb-6">January 2025</p>
            <p className="font-bold italic">{ AUTHOR_NAME }</p>
        </div>

    </div>

  )
}

export default RightHalf