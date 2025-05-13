"use client"

import React, { useEffect, useState } from "react"
import { FaUserEdit } from "react-icons/fa"
import { MdLocationOn, MdOutlineEmail, MdPhone } from "react-icons/md"
import { BsCart4, BsHeart, BsBoxSeam } from "react-icons/bs"
import UpdateProfile from "../modalsandpopups/UpdateProfile"
import { useAuth } from "../contextapis/authentication/AuthProvider"
import { getProfileService } from "@/apiservice/profileService"

const Profile = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    orders: 0,
    totalSpent: 0,
    cartItems: 0,
    wishlist: 0,
  })

  // Fetch profile data from the API
  const getProfile = async () => {
    const response = await getProfileService()

    if (response.success) {
      console.log("profile data: ", response.data.user)
      setUserInfo({
        name: response.data.user.username || "",
        email: response.data.user.email || "",
        phone: response.data.user.phone || "",
        address: response.data.user.address || "",
        orders: response.data.user.orders || 0,
        totalSpent: response.data.user.totalSpent || 0,
        cartItems: response.data.user.cartItems || 0,
        wishlist: response.data.user.wishlist || 0,
      })
    } else {
      console.log(response.message)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  const handleEditClick = () => {
    setShowUpdateModal(true)
  }

  const handleCloseModal = () => {
    setShowUpdateModal(false)
  }

  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return null

  return (
    <>
      <div className="bg-gray-100 shadow-xs rounded-xl max-w-[72rem] w-full mx-auto px-4 py-6 mt-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Profile</h1>

          {/* Profile Info Card */}
          <div className="bg-gray-50 rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold">
                  {userInfo.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{userInfo.name}</h2>
                  <p className="text-sm text-gray-500">{userInfo.email}</p>
                </div>
              </div>

              <button
                onClick={handleEditClick}
                className="flex cursor-pointer items-center gap-2 text-sm bg-blue-100 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-200 transition"
              >
                <FaUserEdit /> Edit
              </button>
            </div>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-center gap-3">
                <MdOutlineEmail className="text-lg text-gray-500" />
                <span>{userInfo.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MdPhone className="text-lg text-gray-500" />
                <span>{userInfo.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3">
                <MdLocationOn className="text-lg text-gray-500" />
                <span>{userInfo.address || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<BsBoxSeam size={26} className="text-blue-500" />}
              label="Orders"
              value={userInfo.orders}
            />
            <StatCard
              icon={<BsCart4 size={26} className="text-green-500" />}
              label="Cart Items"
              value={userInfo.cartItems}
            />
            <StatCard
              icon={<BsHeart size={26} className="text-red-400" />}
              label="Wishlist"
              value={userInfo.wishlist}
            />
            <StatCard
              icon={<span className="text-green-500 font-bold text-lg">₹</span>}
              label="Total Spent"
              value={userInfo.totalSpent.toLocaleString()}
              currency
            />
          </div>
        </div>
      </div>

      {/* Profile Update Modal */}
      {showUpdateModal && (
        <UpdateProfile
          profile={{
            username: userInfo.name,
            email: userInfo.email,
            address: userInfo.address,
            phone: userInfo.phone,
          }}
          onClose={handleCloseModal}
          refetch={getProfile}
        />
      )}
    </>
  )
}

// Stat Card Component
const StatCard = ({
  icon,
  label,
  value,
  currency = false,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  currency?: boolean
}) => {
  return (
    <div className="bg-gray-50 p-5 rounded-xl shadow-md hover:shadow-lg transition duration-200 flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className={`text-2xl  ${currency ? "text-blue-600" : "text-gray-800"}`}>
        {currency ? `₹${value}` : value}
      </p>
    </div>
  )
}

export default Profile
