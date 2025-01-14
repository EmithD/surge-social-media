"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKENDBASE_URL;

const useIfAuthRedirect = (redirectPath: string = '/') => {
    const router = useRouter();
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const checkAuth = async () => {
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
                } else if (res.ok) {
                    router.push(redirectPath);
                } else {
                    setError('Authentication failed');
                    router.push('/signin');
                }
            } catch (err) {
                setError('Error occurred while checking authentication');
                router.push('/signin');
            }
        };

        checkAuth();
    }, [redirectPath, router]);

    return { error };
};
  
export default useIfAuthRedirect;