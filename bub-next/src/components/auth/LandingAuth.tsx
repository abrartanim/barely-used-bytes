"use client";

import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "@/app/lib/AuthContext";

export default function LandingAuth() {
  const { signInWithGoogle, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleLogin = async () => {
    try {
      setError(null);
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      console.error(err);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <div className="">
        <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
        <h3 className="mt-2 text-gray-400">
          Login or Signup with Google to continue with Barely Used Bytes
        </h3>
      </div>

      {error && <div className="mt-4 text-red-400 text-sm">{error}</div>}

      <div className="mt-4">
        <button
          onClick={handleLogin}
          disabled={isSigningIn}
          className="flex items-center gap-3 px-6 py-3 font-semibold bg-[#2c4c46] rounded-lg hover:bg-[#3a615a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a2e2a] focus:ring-[#66f9d1] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaGoogle size={20} />
          {isSigningIn ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
