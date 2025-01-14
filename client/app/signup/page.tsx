"use client";

import Link from 'next/link'
import React, { useEffect, useState }from 'react'
import { useRouter } from 'next/navigation';
import RightHalf from '../components/RightHalf';
import LeftHalf from '../components/LeftHalf';
import ReCAPTCHA from 'react-google-recaptcha';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKENDBASE_URL;

const SignUp = () => {

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/');
        }
    }, [router]);

    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [captcha, setCaptcha] = useState<string | null>('');

    const [error, setError] = useState<string>('');

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if(!captcha){
            setError('Complete ReCaptcha.');
            return;
        }
        
        try {

            const res = await fetch(`${BACKEND_BASE_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    fullName,
                    password
                }),
            });

            if (!res.ok) {
                const errorMessage = await res.json();
                setError(errorMessage.message);
                return;
            }

            router.push("/signin");

        } catch (error) {
            setError('An error occurred');
        }

    };

    return (
        <main>
            <div className="flex h-screen">

                <LeftHalf>

                    <h2 className="text-center font-bold text-xl mb-4 text-gray-800">SIGN UP</h2>
                    <form onSubmit={ handleSignUp } className="text-gray-700">
                        <input
                            type="text"
                            placeholder="Username"
                            id="username"
                            value={ username }
                            onChange={ (e) => setUsername(e.target.value) }
                            className="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            id="username"
                            value={ email }
                            onChange={ (e) => setEmail(e.target.value) }
                            className="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            />
                        <input
                            type="text"
                            placeholder="Full Name"
                            id="username"
                            value={ fullName }
                            onChange={ (e) => setFullName(e.target.value) }
                            className="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            />
                        <input
                            type="password"
                            placeholder="Password"
                            id="username"
                            value={ password }
                            onChange={ (e) => setPassword(e.target.value) }
                            className="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            id="username"
                            value={ confirmPassword }
                            onChange={ (e) => setConfirmPassword(e.target.value) }
                            className="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <ReCAPTCHA sitekey={ process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY! } className="block px-4 mb-4" onChange={ setCaptcha } />

                        { error && <p className='text-red-600 pb-2 text-center'>{error}</p> }

                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Sign Up</button>
                    </form>
                    
                    <p className='pt-3 text-gray-800 text-center'>Already a user? <Link href={'/signin'} className='text-blue-800'>Sign in</Link></p>

                </LeftHalf>

                <RightHalf />
            </div>

        </main>
    )
}

export default SignUp