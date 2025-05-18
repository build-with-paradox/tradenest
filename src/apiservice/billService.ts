import axios from "axios";
import { formatErrorMessages } from "@/utils/utilfunctions";

export const getBillSummaryService = async()=> { 
    const getBillSummaryUrl = `${process.env.NEXT_PUBLIC_URL}api/bill/`;

    try {
        const response = await axios.get(getBillSummaryUrl, { 
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          })

          if(response.status === 201){ 
            return { 
                success: true, 
                bill: response.data 
            }
          }else{  
            return { 
                success: false,
                message: response.data.error
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