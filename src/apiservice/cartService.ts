import axios from "axios";
import { formatErrorMessages } from "@/utils/utilfunctions";

export const createCartService = async (productId: string) => {
  const createCartUrl = `${process.env.NEXT_PUBLIC_URL}/api/cart/addtocart/`;

  try {
    const response = await axios.post(
      createCartUrl,
      { productId },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Create cart error:", error.response.data);

      return {
        success: false,
        message: formatErrorMessages(error.response.data) || "Failed to add to cart",
      };
    } else {
      console.error("An unexpected error occurred:", error);
      return {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      };
    }
  }
};


export const getCartService = async () => {
  const getCartUrl = `${process.env.NEXT_PUBLIC_URL}/api/cart/`;

  try {
    const response = await axios.get(
      getCartUrl,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Create cart error:", error.response.data);

      return {
        success: false,
        message: formatErrorMessages(error.response.data) || "Failed to add to cart",
      };
    } else {
      console.error("An unexpected error occurred:", error);
      return {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      };
    }
  }
};


export const updateProductQuantity = async(productId: string, action:string)=>{ 
  const updateCartItemQuantityUrl = `${process.env.NEXT_PUBLIC_URL}/api/cart/updatequantity/`;
    try {
      const response = await axios.put(updateCartItemQuantityUrl, { productId: productId, action: action })

      if(response.status === 200){ 
        return { 
          success: true,
          message: response.data
        }
      }else{ 
        return { 
          sucess: false,
          message: response.data
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Create cart error:", error.response.data);
  
        return {
          success: false,
          message: formatErrorMessages(error.response.data) || "Failed to add to cart",
        };
      } else {
        console.error("An unexpected error occurred:", error);
        return {
          success: false,
          message: "An unexpected error occurred. Please try again later.",
        };
      }
    }
}