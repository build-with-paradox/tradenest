import { formatErrorMessages } from "@/utils/utilfunctions";
import axios from "axios";

export const getUserOrdersService = async()=>{ 
    const getOrdersUrl = `${process.env.NEXT_PUBLIC_URL}api/orders/getUserOrders`;
    
    try {
        const response = await axios.get(getOrdersUrl, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          })

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
}