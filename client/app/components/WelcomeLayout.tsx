import React, { ReactNode } from 'react'

interface WelcomeLayoutProps {
    children: ReactNode;
    title: string;
}

const WelcomeLayout: React.FC<WelcomeLayoutProps> = ({ children, title }) => {
  return (

    <div className="flex h-screen bg-gray-50">
        
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8 md:shadow-lg">

            <h2 className="text-center font-bold text-2xl md:text-3xl text-gray-800 mb-6">{ title }</h2>


        { children }

        </div>

        <div className="flex flex-col w-1/2 bg-gradient-to-r from-white to-red-400 items-center justify-center space-y-4">

            <h3 className="text-black text-4xl font-bold px-8 text-center">
                <span className="text-red-700">surge</span> SE Internship
            </h3>
            <h3 className="text-black text-xl px-8 text-center">
                January 2025
            </h3>
            <h3 className="text-black text-2xl px-8 text-center">
                { process.env.NEXT_PUBLIC_AUTHOR }
            </h3>
                
        </div>
    </div>
  )
}

export default WelcomeLayout