import { UserProfileInterface } from "@/types/userTypes";
import { formatErrorMessages } from "@/utils/utilfunctions";
import axios from "axios";


export const getProfileService = async () => {
  const getProfileUrl = `${process.env.NEXT_PUBLIC_URL}api/profile/`;

  try {
    const response = await axios.get(getProfileUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Profile fetch error:', error.response.data);

      return {
        success: false,
        message: formatErrorMessages(error.response.data) || 'Failed to fetch profile',
      };
    } else {
      console.error('An error occurred:', error);
      return {
        success: false,
        message: 'An error occurred. Please try again later.',
      };
    }
  }
};



export const updateProfileService = async ({
  username,
  email,
  phone,
  address,
}: UserProfileInterface) => {
  const updateProfileUrl = `${process.env.NEXT_PUBLIC_URL}api/profile/update/`;

  try {
    const response = await axios.put(updateProfileUrl, 
      {
        username,
        email,
        phone,
        address
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, 
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Profile update error:', error.response.data);

      return {
        success: false,
        message: formatErrorMessages(error.response.data) || 'Failed to update profile',
      };
    }
    return {
      success: false,
      message: 'An error occurred while updating the profile',
    };
  }
};
