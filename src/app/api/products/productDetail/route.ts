import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Products";
import { mongooseConnection } from "@/lib/mongooseconnection"


export const GET = async (req: NextRequest) => {
    try {
        await mongooseConnection();

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const product = await Product.findById(productId).lean();


        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product detail" ,productDetail: product }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
};
