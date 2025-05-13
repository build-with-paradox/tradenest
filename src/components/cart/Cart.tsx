"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { FaPlus, FaMinus } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { getCartService, updateProductQuantity } from "@/apiservice/cartService"
import toast from "react-hot-toast"
import BillSummary from "./BillSummary"
import { getBillSummaryService } from "@/apiservice/billService"
import { Bill, CartItem } from "@/types/Bill_and_Cart_Types"


const Cart = () => {
    const [cart, setCart] = useState<CartItem[]>([])


    const getCart = async () => {
        try {
            const result = await getCartService()
            console.log(" get Cart : ", result)
            if (result.success && result.data?.cart?.products) {
                console.log("cart:", result.data.cart)
                setCart(result.data.cart.products)
            } else {
                setCart([])
            }
        } catch (error) {
            console.error("Error fetching cart:", error)
            setCart([])
        }
    }
    

    useEffect(()=>  { 
        getCart()
    }, [])

    const handleIncrease = async(id: string) => {
        const result = await updateProductQuantity(id, "increase")

        if(result.success){ 
            getCart()
            toast(result.message.message)
        }else{ 
            toast(result.message.message)
        }
    }

    const handleDecrease = async(id: string) => {
        const result = await updateProductQuantity(id, "decrease")

        if(result.success){ 
            getCart()
            toast(result.message.message)
        }else{ 
            toast(result.message.message)
        }
    }   

    const handleRemove = (id: string) => {
        setCart((prev) => prev.filter((item) => item.productId !== id))
    }


    const [bill, setBill] = useState<Bill>()

    const getBill = async()=>  { 
        const result = await getBillSummaryService()

        if(result.success){ 
            console.log("Bill: ", result)
            setBill(result.bill.bill)
        }else{ 
            console.log("Bill: " ,result.message)
        }
    }

    useEffect(()=> { 
        getBill()
    }, [cart])

    return (
        <div className="flex flex-col md:flex-row items-start justify-center px-4 py-8 gap-8 max-w-6xl mx-auto">
            {/* Left Side - Products */}
            <div className="bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition p-6 w-full md:w-2/3">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Your Cart</h1>
                {cart && cart.length === 0 ? (
                    <p className="text-gray-500 text-center">Your cart is empty.</p>
                ) : (
                    <div className="space-y-6">
                        {cart && cart.length > 0 && cart.map((item) => (
                            <div
                                key={item.productId}
                                className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm"
                            >
                                <div className="flex items-center gap-4 w-1/2">
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                        <Image
                                            src={item.productImage}
                                            alt={item.productName}
                                            fill
                                            className="object-contain mix-blend-multiply"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-md font-medium text-gray-800">
                                            {item.productName}
                                        </h2>
                                        <p className="text-sm text-gray-500">₹{item.price}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleDecrease(item.productId)}
                                        className="p-2 bg-gray-100 rounded-full cursor-pointer"
                                    >
                                        <FaMinus size={14} />
                                    </button>
                                    <span className="font-medium text-gray-800 ">
                                        {item.quantity_buyed}
                                    </span>
                                    <button
                                        onClick={() => handleIncrease(item.productId)}
                                        className="p-2 bg-gray-100 rounded-full cursor-pointer"
                                    >
                                        <FaPlus size={14} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <p className="font-bold text-gray-700 whitespace-nowrap">
                                        ₹{(item.price * item.quantity_buyed).toLocaleString()}
                                    </p>
                                    <button
                                        onClick={() => handleRemove(item.productId)}
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                    >
                                        <MdDelete size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Side - Bill */}
            <BillSummary cart={cart} bill={bill}/>

        </div>
    )
}

export default Cart
