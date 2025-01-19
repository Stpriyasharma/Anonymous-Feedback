'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

function Navbar() {
  let token = Cookies.get('auth-token');
    token = token?.toString();

    let decodedToken;
   if(token){
    decodedToken = jwtDecode(token);
   }
 
  const username = (decodedToken as any)?.username;
  const router = useRouter()
  const { toast } = useToast();
// utils/auth.ts

 async function signOut() {
  try {
      const response = await fetch('/api/sign-out', {
          method: 'POST',
          credentials: 'include', // Important for including cookies in the request
      });

      if (!response.ok) {
          throw new Error('Failed to sign out');
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: data.message,
        });
          router.push('/sign-in');
      } else {
          throw new Error(data.message);
      }
  } catch (error) {
      console.error('Sign out error:', error);
      // Handle error (e.g., show an error message to the user)
  }
}

  
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Anonymous Feedback
        </a>
        {token ? (
          <>
            <span className="mr-4">
              Welcome, {username}
            </span>
            
            <Button  onClick={signOut}  className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>
            
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;