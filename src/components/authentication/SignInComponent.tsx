"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";


const SignInComponent = () => {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });

  const handleInputChange = (e: any) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const res = await signIn("credentials", {
      redirect: false,
      email: user.email,
      password: user.password,
      callbackUrl: "/",
    });
  
    if (res?.ok) {
      toast.success("Signed in successfully!");
      router.push("/");
    } else {
      toast.error("Invalid email or password");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex flex-col lg:flex-row overflow-hidden">
          {/* Left Side: Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-md shadow-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
                Sign In to Your Account
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Welcome back! Please enter your details.
              </p>

              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded-full focus:ring focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={user.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none ocus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-200 text-blue-500 py-2 rounded-full"
                >
                  Sign In
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6">
                <hr className="flex-grow border-gray-300" />
                <span className="px-3 text-sm text-gray-600">OR</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  <FaGoogle className="mr-2 text-red-500" />
                  Continue with Google
                </button>
                <button
                  onClick={()=> signIn("github", { callbackUrl: "/" })}
                  className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  <FaGithub className="mr-2 text-gray-800" />
                  Continue with GitHub
                </button>
              </div>

              {/* Don't have an account */}
              <p className="mt-6 text-sm text-center text-gray-600">
                Don’t have an account?{" "}
                <Link href="/authentication/signup" className="text-blue-500 hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side: Image */}
          <div
            className="hidden lg:flex lg:w-1/2 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/signin.svg')" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SignInComponent;
