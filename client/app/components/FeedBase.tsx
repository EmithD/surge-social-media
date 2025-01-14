//the idea - have two buttons home and account. when homes clicked general feed, when account clicked account feed.add post as well??
'use client';

import React, { ReactNode, useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useRouter } from 'next/navigation';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKENDBASE_URL;

interface FeedProps {
    children: ReactNode;
}

const FeedBase: React.FC<FeedProps> = ({ children }) => {
    const router = useRouter();

    const [error, setError] = useState<string>('');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            setError('');
    
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/signin');
                return;
            }
    
            try {
                const res = await fetch(`${BACKEND_BASE_URL}/api/auth/profile`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                });
        
                if (res.status === 403) {
                setError('Token expired');
                localStorage.removeItem("token");
                router.push('/signin');
                }
        
                const data = await res.json();
                setUser(data);

            } catch (error) {
                setError('Error occurred');
            }
        };
    
        getUser();
    }, [router]);

    const handleSignout = () => {

        localStorage.removeItem('token');
        router.push('/signin');
        
    };



    return (
        <div className="flex h-screen">

            <div className="w-1/5 bg-gray-100 flex items-start justify-center pt-10">
                <h1 className="text-lg font-bold">Logo</h1>
            </div>

            {children}

            <div className="w-1/5 bg-gray-50 flex flex-col items-center pt-10">
                <div className="w-24 h-24 rounded-full bg-gray-300 mb-4">
                    {/* photo */}
                </div>
                <h2 className="text-lg font-bold">{user?.fullName || ""}</h2>
                <p className="text-gray-500">{user?.username || ""}</p>
                <div className='pt-4'>
                    <ButtonGroup variant="contained" aria-label="Basic button group" size='small' className=''>
                        <Button>Home</Button>
                        <Button>Upload</Button>
                        <Button>My Posts</Button>
                        <Button color='error' onClick={ handleSignout }>Signout</Button>
                    </ButtonGroup>
                </div>
            </div>

        </div>
    )
}

export default FeedBase