export interface CartItem {
    _id:string;
    productId: string
    productName: string
    productImage: string
    price: number
    quantity_buyed: number
}

export interface Bill {
    subtotal: number
    gstPercent: number
    gstAmount: number
    totalAmount: number
    coupon?: {
        code: string
        discountPercent: number
        discountAmount: number
    }
}


export interface BillSummaryProps {
    cart: CartItem[]
    bill: Bill | undefined
}
