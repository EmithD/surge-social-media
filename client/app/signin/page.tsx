"use client";

import React, { useState }from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RightHalf from '../components/RightHalf';
import LeftHalf from '../components/LeftHalf';

import useIfAuthRedirect from '../hooks/useIfAuthRedirect'
import ReCAPTCHA from 'react-google-recaptcha';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKENDBASE_URL;
// doesnt work without next_public_ prefix

const SignIn = () => {

    const router = useRouter();

    useIfAuthRedirect('/')

    const [usernameOrEmail, setusernameOrEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [captcha, setCaptcha] = useState<string | null>();
    const [error, setError] = useState<string>('');

    const handleSignIn = async (e: React.FormEvent) => {

        e.preventDefault();
        setError('');

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
                const errorMessage = await res.json();
                setError(errorMessage.message);
                return;
            }

            if(!captcha){
                setError('Complete ReCaptcha.');
                return;
            }

            const data = await res.json();
            const { token } = data;

            localStorage.setItem("token", token);

            router.push("/");

        } catch (error) {
            setError('An error occurred');
        }
    };

    return (

        <div className="flex h-screen">

            <LeftHalf>

                <h2 className="text-center font-bold text-xl mb-4 text-gray-800">SIGN IN</h2>

                <form onSubmit={ handleSignIn } className="text-gray-700">
                    
                    <input
                        type="text"
                        placeholder="Username or Email"
                        id="usernameOrEmail"
                        value={ usernameOrEmail }
                        onChange={ (e) => setusernameOrEmail(e.target.value) }
                        className="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    
                    <input
                        type="password"
                        placeholder="Password"
                        id='password'
                        value={ password }
                        onChange={ (e) => setPassword(e.target.value) }
                        className="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <ReCAPTCHA sitekey={ process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY! } className="block px-4 mb-4" onChange={ setCaptcha } />

                    { error && <p className='text-red-600 pb-2 text-center'>{error}</p> }

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    >
                        Sign In
                    </button>
                    
                </form>

                <p className='pt-3 text-gray-800 text-center'>New here? <Link href={'/signup'} className='text-blue-800'>Sign Up</Link></p>

            </LeftHalf>

            <RightHalf />

        </div>

    )
};

export default SignIn;