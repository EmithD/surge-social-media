//the idea - have two buttons home and account. when homes clicked general feed, when account clicked account feed.add post as well??
'use client';

import React, { ReactNode, useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useRouter } from 'next/navigation';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKENDBASE_URL;

interface FeedProps {
    children: ReactNode;
}

interface User {
    userID?: string,
    fullName?: string;
    username?: string;
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const FeedBase: React.FC<FeedProps> = ({ children }) => {
    const router = useRouter();

    const [, setError] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState('');

    useEffect(() => {
        const getUser = async () => {
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
                    localStorage.removeItem('token');
                    router.push('/signin');
                    return;
                }

                const data = await res.json();
                setUserData(data._id);
                setUser(data);
            } catch (err) {
                setError('Error occurred');
            }
        };

        getUser();
    }, [router]);

    const handlePostUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const token = localStorage.getItem('token');
    
        if (!file) {
            console.error("No file selected.");
            return;
        }
    
        const formData = new FormData();
    
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        if (!apiKey) {
            console.error("API key is not defined.");
            return;
        }
        
        formData.append('key', apiKey);
        formData.append('image', file);
    
        try {
            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                setError("Failed to upload image:");
                return;
            }
    
            const data = await response.json();
    
            if (data.success) {

                try {
                    console.log(user)
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDBASE_URL}/api/posts/`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            userID: userData,
                            imageURL: data.data.url,
                            imageDeleteURL: data.delete_url
                        }),
                    });

                    if (res.status === 403) {
                        setError('Token expired');
                        localStorage.removeItem('token');
                        router.push('/signin');
                        return;
                    };

                    if (!res.ok) {
                        setError('Upload failed');
                        return;
                    }

                } catch (error) {
                    console.error(error);
                }

                console.log("Image URL:", data.data.url);

            } else {

                console.error("Image upload failed:", data);

            }

        } catch (error) {

            console.error("An error occurred during the upload:", error);
        }
    };
    
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
                    <ButtonGroup variant="contained" aria-label="Basic button group" size='small'   className=''>
                        <Button>Home</Button>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            >
                            Upload
                            <VisuallyHiddenInput
                                type="file"
                                onChange={ handlePostUpload }
                                multiple = { false }
                            />
                        </Button>
                        <Button color='error' onClick={ handleSignout }>Signout</Button>
                    </ButtonGroup>
                </div>
            </div>

        </div>
    )
}

export default FeedBase