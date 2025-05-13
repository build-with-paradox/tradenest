import { updateProfileService } from "@/apiservice/profileService"
import { UserProfileInterface } from "@/types/userTypes"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { AiOutlineClose } from "react-icons/ai"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

interface UserProfileDetailsProps {
  profile: UserProfileInterface
  onClose: () => void
  refetch?: () => void
}

const UpdateProfile: React.FC<UserProfileDetailsProps> = ({ profile, onClose, refetch }) => {

  const [updatedProfile, setUpdatedProfile] = useState({
    username: profile.username,
    email: profile.email,
    phone: profile.phone ? `+${String(profile.phone).replace(/^\+/, "")}` : "", 
    address: profile.address,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUpdatedProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhoneChange = (value: string | undefined) => {
    setUpdatedProfile((prev) => ({
      ...prev,
      phone: value || '', // Ensure it's an empty string if undefined
    }))
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    const phone = updatedProfile.phone ? `+${updatedProfile.phone.replace(/^\+/, "")}` : "";

    const result = await updateProfileService({
      username: updatedProfile.username,
      email: updatedProfile.email,
      phone,
      address: updatedProfile.address,
    })

    if (result.success) {
      toast.success(result.data.message, {
        style: {
          background: "#F9FAFB",
        },
      });
      setUpdatedProfile({ username: "", email: "", phone: "", address: "" });
      if(refetch){ 
        refetch()
      }
      onClose()
    } else {
      toast.error(result.data.error, {
        style: {
          background: "#F9FAFB",
        },
      });
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-[90%] md:w-[70%] lg:w-[50%] h-auto max-h-[90vh] overflow-y-auto relative p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-red-500 transition"
        >
          <AiOutlineClose size={22} />
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update Profile</h2>

        {/* Form Fields */}
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={updatedProfile.username}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={updatedProfile.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
            <PhoneInput
              international
              defaultCountry="IN"
              value={updatedProfile.phone || ""}
              onChange={handlePhoneChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Address</label>
            <textarea
              name="address"
              value={updatedProfile.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {/* Update Button */}
          <div className="-pt-2">
            <button
              type="submit"
              className="w-full bg-blue-200 text-blue-500 font-medium py-2 px-6 cursor-pointer rounded-full"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateProfile
