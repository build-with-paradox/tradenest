import axios from "axios";
import { formatErrorMessages } from "@/utils/utilfunctions";

export const switchWishlistService = async (productId: string) => {
  const wishlistUrl = `${process.env.NEXT_PUBLIC_URL}api/wishlist/switchwishlist/`;

  try {
    const response = await axios.post(
      wishlistUrl,
      { productId },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        message: response.data.message,
        data: response.data,
      };
    }

    return {
      success: false,
      message: "Unexpected server response",
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Wishlist switch error:", error.response.data);
      return {
        success: false,
        message: formatErrorMessages(error.response.data) || "Wishlist action failed",
      };
    } else {
      console.error("Unexpected error:", error);
      return {
        success: false,
        message: "Unexpected error occurred. Please try again later.",
      };
    }
  }
};


export const getWishListService = async()=> { 
    const getWishlistUrl = `${process.env.NEXT_PUBLIC_URL}api/wishlist/`;

    try {
        const response = await axios.get(getWishlistUrl,
             { withCredentials: true, 
                headers: { 
                    "Content-Type": "application/json"
                }
              })

        if(response.status === 200){ 
            return { 
                success: true, 
                data:  response.data
            }
        }

        return {
            success: false,
            message: "Unexpected server response",
          };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Wishlist switch error:", error.response.data);
            return {
              success: false,
              message: formatErrorMessages(error.response.data) || "Wishlist action failed",
            };
          } else {
            console.error("Unexpected error:", error);
            return {
              success: false,
              message: "Unexpected error occurred. Please try again later.",
            };
          }
    }
}