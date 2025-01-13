"use client";

import React, { useState, useEffect }from 'react'
import { useRouter } from 'next/navigation';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKENDBASE_URL;
//shit doesnt work without next_public_ prefix

const SignIn = () => {

    const [usernameOrEmail, setusernameOrEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();

    const [error, setError] = useState<string>('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            router.push('/feed');
        }

    }, [router]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        console.log(BACKEND_BASE_URL);

        try {

            const res = await fetch(`${BACKEND_BASE_URL}/api/auth/signin`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    usernameOrEmail,
                    password
                }),
            });
            
            if (!res.ok) {
                setError('Invalid credentials');
                return;
            }

            const data = await res.json();
            const { token } = data;

            localStorage.setItem("token", token);

            router.push("/feed");

        } catch (error) {
            setError('An error occurred');
        }
    };

    return (
        <main>
            <div className="flex h-screen">

                {/* Left Section */}
                <div className="flex flex-1 relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-red-200">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                            <h2 className="text-center font-bold text-xl mb-4 text-gray-800">SIGN IN</h2>

                            <form onSubmit={ handleSignIn } className="text-gray-700">
                                
                                <input
                                    type="text"
                                    placeholder="Username or Email"
                                    id="usernameOrEmail"
                                    value={ usernameOrEmail }
                                    onChange={ (e) => setusernameOrEmail(e.target.value) }
                                    className="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                
                                <input
                                    type="password"
                                    placeholder="Password"
                                    id='password'
                                    value={ password }
                                    onChange={ (e) => setPassword(e.target.value) }
                                    className="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                { error && <p className='text-red-600 pb-2 text-center'>{error}</p> }

                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                                >
                                    Submit
                                </button>

                            </form>

                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-center justify-center flex-1 bg-white">
                    <h1 className="font-bold text-xl mb-2">Surge SE Internship</h1>
                    <p className="text-gray-500 mb-4">January 2025</p>
                    <p className="font-bold italic">Emith Dinsara</p>
                </div>
            </div>

        </main>
    )
}

export default SignIn