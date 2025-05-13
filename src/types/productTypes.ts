export type ProductInterface = {
    id: string;
    productName: string;
    productDescription: string;
    productImage: { url: string }; 
    price: number;
    rating: number;
  };


// Define the type for the product
export type ProductDetailInterface = {
  _id: string
  productName: string
  productDescription: string
  productImage: { url: string }; 
  price: number
  rating: number
  delivery: string
  stock: string
}