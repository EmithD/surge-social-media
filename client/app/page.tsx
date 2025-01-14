"use client";

import React from 'react'
import useIfAuthRedirect from './hooks/useIfAuthRedirect';
import FeedBase from './components/FeedBase';

const Home = () => {

    useIfAuthRedirect('/')

    return (
        <FeedBase>
            
            {/* Main Content */}
            <div className="w-3/5 overflow-y-scroll bg-white">
                <div className="p-5">
                    {/* Post */}
                    <div className="border-b pb-5 mb-5">
                        <div className="w-full h-64 bg-gray-300 mb-3">Post Image</div>
                        <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="mr-2 text-xl">❤️</span>
                            <p>No. of likes</p>
                        </div>
                        <div className="text-gray-600">username</div>
                        <div className="text-gray-400">formatted date</div>
                        </div>
                    </div>

                    {/* Another Post Example */}
                    <div className="border-b pb-5">
                        <div className="w-full h-64 bg-gray-300 mb-3">Post Image</div>
                        <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="mr-2 text-xl">❤️</span>
                            <p>23</p>
                        </div>
                        <div className="text-gray-600">healthy_unicorn23</div>
                        <div className="text-gray-400">2d</div>
                        </div>
                    </div>
                </div>
            </div>

        </FeedBase>
    )
}

export default Home
