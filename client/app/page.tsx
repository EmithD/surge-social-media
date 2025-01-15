"use client";

import React, {useRef, useState, useEffect} from 'react'
import useIfAuthRedirect from './hooks/useIfAuthRedirect';
import { useRouter } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {styled} from "@mui/material/styles";
import LogoOnHome from './components/LogoOnHome';
import Image from 'next/image';
import { ButtonGroup } from '@mui/material';

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
    userID: string,
    fullName: string;
    username: string;
    pfpURL: string;
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

    const [triggerFetchProfile, setTriggerFetchProfile] = useState(false);

    const [pfpURL, setPFPURL] = useState<string>('https://res.cloudinary.com/dvrgbm47v/image/upload/v1736933808/hrqfnkj1ojqkhaa6e2be.png');

    const [error, setError] = useState<string>('');
    const [user, setUser] = useState<User>();
    const [userID, setUserID] = useState<string>('')
    
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
                setPFPURL(data.pfp);
                setUser(data);

            } catch (error) {
                setError('Error occurred');
                console.log(error)
            }
        };

        getUser();

    }, [router, triggerFetchProfile]);

    const handlePostUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/signin');
            return;
        }
    
        if (!file) {
            console.log("No file selected.");
            return;
        }
    
        const formData = new FormData();
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
        if (!cloudName || !uploadPreset) {
            console.log("Cloudinary configuration is missing.");
            return;
        }
    
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
    
        try {
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
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDBASE_URL}/api/posts/`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            userID: userID,
                            imageURL: data.secure_url,
                            assetID: data.asset_id,
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
                method: 'PUT',
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

        } catch (error) {

            console.error("Failed to delete", error);

        }
    };

    const handlePFPUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/signin');
            return;
        }
    
        if (!file) {
            console.log("No file selected.");
            return;
        }

        const formData = new FormData();
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
        if (!cloudName || !uploadPreset) {
            console.log("Cloudinary configuration is missing.");
            return;
        }
    
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
    
        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                console.log("Failed to upload pfp to cloudinary.");
                return;
            }
    
            const data = await response.json();

            if (data.secure_url) {

                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDBASE_URL}/api/user/uploadPFP`, {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            userID: userID,
                            imageURL: data.secure_url,
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
                        setPFPURL(data.secure_url);
                        setTriggerFetchProfile((prev) => !prev);
                        setTriggerFetchPosts((prev) => !prev);
                    }
    
                } catch (error) {
                    console.log("Error while sending PFP data to backend:", error);
                }
    
            } else {
                console.log("PFP upload failed:", data);
            }
    
        } catch (error) {
            console.log("An error occurred during the upload:", error);
        }

    };

    return (
        
        <div className="flex h-screen">

            <LogoOnHome />

            <div className="w-3/5 overflow-y-scroll bg-white">

                <div className="p-5 space-y-8">

                    {posts.map((post, index) => (
                        <div
                            key={post._id}
                            ref={index === posts.length - 1 ? lastPostRef : null}
                            className="border border-gray-200 rounded-lg shadow-md p-5"
                        >
                            
                            {/* image */}
                            <div className="w-full h-full mb-4">
                                {post.imageURL ? (
                                    <Image
                                        src={post.imageURL}
                                        alt="Post Picture"
                                        width={1080}
                                        height={1080}
                                        className="object-contain rounded-lg"
                                        priority
                                    />
                                ) : (
                                    <p className="text-gray-500">Image not available</p>
                                )}
                            </div>

                            {/* imagecontent */}
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Button 
                                            color="error" 
                                            className="text-red px-4 py-2 rounded-md hover:bg-red-600 hover:text-white transition"
                                            onClick={() => handleLike(post._id)}
                                        >
                                            Like
                                        </Button>
                                        <p className="text-gray-700 font-medium">{post.likesCount}</p>
                                    </div>

                                    <p className="text-gray-600 text-sm font-medium text-center">
                                        {post.userID.username}
                                    </p>
                                </div>


                                <p className="text-gray-400 text-sm text-end">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </p>

                                {post.userID._id === userID && (
                                    <Button 
                                        color="error" 
                                        className="text-red px-4 py-2 rounded-md hover:bg-red-600 hover:text-white transition"
                                        onClick={() => handleDelete(post._id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </div>  

                        </div>
                    ))}

                    {!hasMore && (
                        <p className="text-center text-gray-500 mt-6">
                            No more posts.
                        </p>
                    )}

                </div>
            </div>

            <div className="w-1/5 bg-gray-50 flex flex-col items-center py-10 space-y-6 shadow-lg rounded-lg">


                <div className="w-32 h-32 rounded-full overflow-hidden shadow-md">
                    <Button
                        component="label"
                        className="block w-full h-full p-0 border-none bg-transparent cursor-pointer"
                    >
                        <Image
                            src={pfpURL || 'https://res.cloudinary.com/dvrgbm47v/image/upload/v1736933808/hrqfnkj1ojqkhaa6e2be.png'}
                            alt="Profile Picture"
                            width={1080}
                            height={1080}
                            className="object-cover rounded-full"
                            priority
                        />
                        <input
                            type="file"
                            className="hidden"
                            onChange={handlePFPUpload}
                            accept="image/*"
                        />
                    </Button>
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-gray-800">{user?.fullName}</h2>
                    <p className="text-sm text-gray-500">{user?.username}</p>
                </div>  

                <div className="pt-4 space-y-3">
                    <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Button
                            component="label"
                            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition flex items-center space-x-2"
                        >
                            {/* <CloudUploadIcon className="text-white" /> */}
                            <span>Upload</span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={ handlePostUpload }
                                accept="image/*"
                            />
                        </Button>

                        <Button
                            color="error"
                            onClick={ handleSignout }
                            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-900 transition flex items-center space-x-2"
                        >
                            {/* <LogoutIcon className="text-white" /> */}
                            <span>Sign Out</span>
                        </Button>
                    </ButtonGroup>

                </div>
            </div>


        </div>

    )
};

export default Home
