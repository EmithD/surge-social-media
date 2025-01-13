"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useIfAuthRedirect = (redirectPath = '/') => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push(redirectPath);
        } else {
            router.push('/signin');
        }
    }, [router, redirectPath]);
    };
  
export default useIfAuthRedirect;