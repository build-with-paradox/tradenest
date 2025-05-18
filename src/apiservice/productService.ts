import { formatErrorMessages } from "@/utils/utilfunctions";
import axios from "axios";

export const getAvailableProducts = async()=> { 
    const getAvailableProductsUrl = `${process.env.NEXT_PUBLIC_URL}api/products`;
    try {
        const response = await axios.get(getAvailableProductsUrl, {
            headers: {
              "Content-Type": "application/json", 
            },
          });
  
          if(response.status === 200){ 
            return { 
                success: true,
                product: response.data.products,
            }
          }else{ 
            return { 
                success: false,
                error: response.data.error
            }
          }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Upload error:", error.response.data);
      
            return {
              success: false,
              message: formatErrorMessages(error.response.data) || "Failed to upload product",
            };
          } else {
            console.error("An error occurred:", error);
            return {
              success: false,
              message: "An error occurred. Please try again later.",
            };
          }
    }
}


export const getProductDetail = async(id: string)=> { 
  const getProductDetailUrl = `${process.env.NEXT_PUBLIC_URL}/api/products/productDetail?productId=${id}`;

  try {
    const response = await axios.get(getProductDetailUrl, { 
      headers: { 
        'Content-Type': 'application/json'
      }
    })

    if(response.status === 200){ 
      return { 
        success: true,
        productDetail: response.data.productDetail
      }
    }else{ 
      return { 
        success: false, 
        productDetail: [], 
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Upload error:", error.response.data);

      return {
        success: false,
        message: formatErrorMessages(error.response.data) || "Failed to upload product",
      };
    } else {
      console.error("An error occurred:", error);
      return {
        success: false,
        message: "An error occurred. Please try again later.",
      };
    }
  }
}


export const getPopularProductsService = async () => {
  const url = `${process.env.NEXT_PUBLIC_URL}/api/products/popularProducts`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 && response.data) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      console.warn("Unexpected response structure:", response);
      return {
        success: false,
        message: "Unexpected response from server.",
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch popular products";

      console.error("API error:", errMessage);

      return {
        success: false,
        message: errMessage,
      };
    }

    console.error("Unknown error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};


export const getFeaturedProductsService = async()=> { 
  const getFeaturedProductUrl = `${process.env.NEXT_PUBLIC_URL}/api/products/featuredProducts`;

  try {
      const response = await axios.get(getFeaturedProductUrl, { 
        headers: { 
          "Content-Type": "application/json"
        }
      })

      if(response.status === 200){ 
        return { 
          success: true, 
          message: response.data.message, 
          products: response.data.products
        }
      }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {

      return {
        success: false,
        message: formatErrorMessages(error.response.data) || "Failed to get product",
      };
    } else {
      console.error("An error occurred:", error);
      return {
        success: false,
        message: "An error occurred. Please try again later.",
      };
    }
  }
}


export const getCategorizedProductsService = async( category: string, search: string | null | undefined )=> { 
  const getCategorizedProductUrl = `${process.env.NEXT_PUBLIC_URL}/api/products/categorizedproducts/?category=${category}&productSearch=${search}`;

  try {
    const response = await axios.get(getCategorizedProductUrl, { 
      headers: {
        "Content-Type": "application/json",
      },
    })

    if(response.status === 200){ 
      return { 
        success: true, 
        message: response.data.message, 
        products: response.data.products
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
      return {
        success: false,
        message: "An error occurred. Please try again later.",
      };
  }
}