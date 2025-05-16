"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { createUserService } from "@/apiservice/authservice";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignUpComponent = () => {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({ username: "", email: "", password: "" });

  const router = useRouter()

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); 
  };

  const validateForm = () => {
    let newErrors = { username: "", email: "", password: "" };
    let isValid = true;

    if (!user.username) {
      newErrors.username = "Full Name is required";
      isValid = false;
    }
    if (!user.email) {
      newErrors.email = "Email is required";
      isValid = false;
    }
    if (!user.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await createUserService({
      username: user.username,
      email: user.email,
      password: user.password,
    });

    if (result.success) {
      toast.success(result.message, {
        style: {
          background: "#F9FAFB",
        },
      });
      setUser({ username: "", email: "", password: "" });

      router.push('/authentication/signin')
      
    } else {
      toast.error(result.message, {
        style: {
          background: "#F9FAFB",
        },
      });
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex flex-col lg:flex-row overflow-hidden">
          {/* Left Side: Image */}
          <div
            className="hidden lg:flex lg:w-1/2 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/signup.svg')" }}
          ></div>

          {/* Right Side: Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-md shadow-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
                Create an Account
              </h2>

              <p className="text-sm text-gray-500 text-center mb-2">
                Shop smarter. Sign up now!
              </p>

              <form className="space-y-4" method="POST" onSubmit={handleSignup}>
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm text-gray-600 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full px-4 py-2 border border-gray-200 rounded-2xl focus:ring focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                </div>

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
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded-2xl focus:ring focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-200 rounded-2xl focus:ring focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-200 text-blue-500 py-2 rounded-full cursor-pointer"
                >
                  Sign Up
                </button>
              </form>

              <div className="space-y-2 mt-5">
                <button
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <FaGoogle className="mr-2 text-red-500" />
                  Continue with Google
                </button>
                <button
                  onClick={() => signIn("github", { callbackUrl: "/" })}
                  className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <FaGithub className="mr-2 text-gray-800" />
                  Continue with GitHub
                </button>
              </div>

              <p className="mt-4 text-sm text-center text-gray-500">
                Already have an account?{" "}
                <Link href="/authentication/signin" className="text-blue-600 hover:underline">
                  Sign-in
                </Link>
              </p>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpComponent;
