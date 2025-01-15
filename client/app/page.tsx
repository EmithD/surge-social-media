"use client";

import React, {useRef, useState, useEffect} from 'react'
import useIfAuthRedirect from './hooks/useIfAuthRedirect';
import { useRouter } from 'next/navigation';
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {styled} from "@mui/material/styles";
import LogoOnHome from './components/LogoOnHome';
import Image from 'next/image';

interface Post {
    _id: string;
    userID: {
        _id: string;
        username: string;
    };
    likesCount: number;
    likedBy: string[]; 
    imageURL: string;
    createdAt: string;
};

interface User {
    userID?: string,
    fullName?: string;
    username?: string;
};

const VisuallyHiddenInput = styled('input') ({
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

const Home = () => {

    useIfAuthRedirect('/');
    
    const router = useRouter();

    const [posts, setPosts] = useState<Post[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [triggerFetchPosts, setTriggerFetchPosts] = useState(false);

    const [error, setError] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [userID, setUserID] = useState<string>('');
    
    const lastPostRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        const getUser = async () => {

            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/signin');
                return;
            }

            try {

                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDBASE_URL}/api/auth/profile`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!res.ok) {

                    setError('Token expired');
                    localStorage.removeItem('token');
                    console.log(error)
                    router.push('/signin');

                }

                const data = await res.json();
                setUserID(data._id);
                setUser(data);

            } catch (error) {
                setError('Error occurred');
                console.log(error)
            }
        };

        getUser();

    }, [router]);

    const handlePostUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const token = localStorage.getItem('token');
    
        if (!file) {
            console.log("No file selected.");
            return;
        }
    
        const formData = new FormData();
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME; // Set in .env file
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET; // Set in .env file
    
        if (!cloudName || !uploadPreset) {
            console.log("Cloudinary configuration is missing.");
            return;
        }
    
        // Add Cloudinary-specific fields to FormData
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
    
        try {
            // Upload the image to Cloudinary
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                console.log("Failed to upload image to Cloudinary.");
                return;
            }
    
            const data = await response.json();
    
            if (data.secure_url) {
                try {
                    // Send the image URL to your backend
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDBASE_URL}/api/posts/`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            userID: userID,
                            imageURL: data.secure_url,
                            publicId: data.public_id, // Optional: Store for future deletion if needed
                        }),
                    });
    
                    if (res.status === 403) {
                        console.log("Token expired.");
                        localStorage.removeItem('token');
                        router.push('/signin');
                        return;
                    }
    
                    if (!res.ok) {
                        console.log('Failed to save image data to backend.');
                        return;
                    } else {
                        console.log("Image upload successful and data saved to backend.");
                        setTriggerFetchPosts((prev) => !prev);
                    }
    
                } catch (error) {
                    console.log("Error while sending data to backend:", error);
                }
    
            } else {
                console.log("Image upload failed:", data);
            }
    
        } catch (error) {
            console.log("An error occurred during the upload:", error);
        }
    }

    const handleSignout = () => {

        localStorage.removeItem('token');
        router.push('/signin');

    };

    useEffect(() => {

        const fetchPosts = async () => {

            try {

                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDBASE_URL}/api/posts/`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('token');
                    router.push('/signin');
                }

                const data = await res.json();

                if (Array.isArray(data.posts)) {

                    setPosts((prev) => {

                        const existingIds = new Set(prev.map((post) => post._id));
                        const newPosts = data.posts.filter((post: Post) => !existingIds.has(post._id));
                        return [...prev, ...newPosts];

                    });

                }

                setHasMore(data.hasMore ?? false);

            } catch (error) {
                console.log("Failed to fetch posts", error);
            }
        };

        fetchPosts();

    }, [router, triggerFetchPosts]);

    const handleLike = async (postID: string) => {

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/signin');
            return;
        }

        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDBASE_URL}/api/posts/like`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    postID,
                    userID
                }),
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('token');
                    router.push('/signin');
                }
                return;
            }
            
            const data = await res.json();
            
            //*RE-READ*
            setPosts((prev) =>
                prev.map((post) =>
                    post._id === postID
                        ? { ...post, likesCount: data.likesCount }
                        : post
                )
            );

        } catch (error) {

            console.error("Failed to toggle like", error);

        }
    };

    const handleDelete = async (postID: string) => {
        
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/signin');
            return;
        }

        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDBASE_URL}/api/posts/`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    postID,
                }),
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('token');
                    router.push('/signin');
                }
                return;
            }

            setTriggerFetchPosts((prev) => !prev);
            router.refresh();

        } catch (error) {

            console.error("Failed to delete", error);

        }
    };

    return (
        
        <div className="flex h-screen">

            <LogoOnHome />

            <div className="w-3/5 overflow-y-scroll bg-white">

                <div className="p-5">

                    {posts.map((post, index) => (
                        <div
                            key={post._id}
                            ref={index === posts.length - 1 ? lastPostRef : null}
                            className="border-b pb-5 mb-5"
                        >

                            <div
                                className="w-full h-full mb-3"
                            >
                                <Image
                                    src={ post.imageURL } 
                                    alt="Picture" 
                                    width={1080} 
                                    height={1080} 
                                    className="object-contain"
                                    priority
                                />
                                
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">


                                    <Button color="error" onClick={() => handleLike(post._id)}>
                                        Like
                                    </Button>


                                    <p className='ml-4'>{post.likesCount}</p>
                                </div>
                                <div className="text-gray-600">{post.userID.username}</div>


                                {post.userID._id == userID ? <Button color="error" onClick={() => handleDelete(post._id)}>
                                        Delete
                                </Button> : ""}


                                <div className="text-gray-400">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}

                    {!hasMore && <p className="text-center mt-4 text-gray-500">No more posts.</p>}
                </div>
            </div>

            <div className="w-1/5 bg-gray-50 flex flex-col items-center pt-10">
            
                <div className="w-24 h-24 rounded-full bg-gray-300 mb-4">
                    {/* photo */}
                </div>
                <h2 className="text-lg font-bold">{user?.fullName || ""}</h2>
                <p className="text-gray-500">{user?.username || ""}</p>

                <div className='pt-4'>

                    <ButtonGroup variant="contained" aria-label="Basic button group" size='small' className=''>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon/>}
                        >
                            Upload
                            <VisuallyHiddenInput
                                type="file"
                                onChange={ handlePostUpload }
                                multiple={ false }
                                accept="image/*"
                            />
                        </Button>
                        <Button color='error' onClick={handleSignout}>Signout</Button>
                    </ButtonGroup>

                </div>

            </div>

        </div>

    )
};

export default Home
