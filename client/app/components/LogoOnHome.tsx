import Image from 'next/image'
import React from 'react'

const LogoOnHome = () => {

  return (

    <div className="w-1/5 bg-gray-100 flex items-start justify-center pt-10">

        <Image
            src="/Emith-removebg-preview.png" 
            alt="Logo" 
            width={200} 
            height={200} 
            className="object-contain"
            priority
        />

    </div>

  )
};

export default LogoOnHome