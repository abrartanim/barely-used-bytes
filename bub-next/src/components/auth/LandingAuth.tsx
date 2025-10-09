'use client';

import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function LandingAuth() {
  const router = useRouter();

  const handleLogin = () => {
    // Here you would typically handle the Google authentication flow.
    // For now, we'll just redirect to the products page.
    router.push('/products');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <div className="">
        <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
        <h3 className="mt-2   text-gray-400 ">
          Login or Signup with google to continue with Barely Used Bytes
        </h3>
      </div>

      <div className="mt-4">
        <button
          onClick={handleLogin}
          className="flex items-center gap-3 px-6 py-3 font-semibold bg-[#2c4c46] rounded-lg hover:bg-[#3a615a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a2e2a] focus:ring-[#66f9d1] cursor-pointer"
        >
          <FaGoogle size={20} />
          Click me to move forward :)
        </button>
      </div>
    </div>
  );
}
