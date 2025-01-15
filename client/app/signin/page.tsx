"use client";

import React, { useState }from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import useIfAuthRedirect from '../hooks/useIfAuthRedirect'
import ReCAPTCHA from 'react-google-recaptcha';
import BlueButton from '../components/BlueButton';
import WelcomeLayout from '../components/WelcomeLayout';

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

        <WelcomeLayout title={'Sign in to your account'}>
            
            <form onSubmit={handleSignIn} className="text-gray-700 w-full max-w-md space-y-4">

                <input
                    type="text"
                    placeholder="Username or Email"
                    id="usernameOrEmail"
                    value={usernameOrEmail}
                    onChange={(e) => setusernameOrEmail(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />

                <div className="flex justify-center">
                    <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} className="mt-4" onChange={setCaptcha} />
                </div>

                {error && <p className="text-red-600 text-center text-sm">{error}</p>}

                <BlueButton buttonContent= { 'Sign in' } />

            </form>

            <p className="text-gray-600 mt-6">
                New here?{' '} <Link href="/signup" className="text-blue-600 hover:underline"> Sign Up</Link>
            </p>

        </ WelcomeLayout>
    )
};

export default SignIn;