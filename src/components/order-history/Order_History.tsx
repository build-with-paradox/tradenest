"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/utils/utilfunctions";
import { motion } from "framer-motion";
import { getUserOrdersService } from "@/apiservice/ordersService";

interface Product {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity_buyed: number;
}

interface Order {
  _id: string;
  user: string;
  products: Product[];
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  amount: number;
  delivery_status: "Pending" | "Shipped" | "Delivered";
  delivery_address: string;
  delivery_date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const tabs = ["All Orders", "On Review", "Shipped", "Delivered"] as const;
const statusSteps = ["On Review", "Shipped", "Delivered"];

const OrderProgress: React.FC<{ currentStepIndex: number; noOrder?: boolean }> = ({ currentStepIndex, noOrder }) => {
  const stepPercent = (currentStepIndex / (statusSteps.length - 1)) * 100;

  return (
    <div className="relative w-full pt-10 pb-6 px-4">
      {/* Background Progress Bar */}
      <div className="absolute top-10 left-6 right-6 h-1 bg-gray-300 rounded-full" />

      {/* Animated Progress Bar */}
      <motion.div
        className="absolute top-10 left-6 h-1 bg-blue-500 rounded-full z-10"
        initial={{ width: 0 }}
        animate={{ width: noOrder ? "0%" : currentStepIndex === 0 ? "17%" : `${stepPercent}%` }}
        transition={{ duration: 0.6 }}
      />
      <motion.div
        className="absolute top-[-0.3rem] z-20"
        initial={{ left: "0%" }}
        transition={{ duration: 1 }}
      >
        <motion.img
          src="/assets/warehouse.gif"
          alt="Warehouse"
          className="w-12 mix-blend-multiply"
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />

      </motion.div>
      {/* Truck Icon */}
      <motion.div
        className="absolute top-[0.5rem] z-20"
        initial={{ left: "0%" }}
        animate={{
          left: noOrder
            ? "0%"
            : currentStepIndex === 0
              ? "17%"
              : `calc(${stepPercent}% - 1rem)`,
        }}
        transition={{ duration: 1 }}
      >
        <motion.img
          src="/assets/delivery.gif"
          alt="Truck"
          className="w-8 mix-blend-multiply"
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.div>

      {/* Step Indicators */}
      <div className="flex justify-between mt-6 px-4 relative z-20">
        {statusSteps.map((step, index) => (
          <div key={index} className="flex flex-col items-center w-full text-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                noOrder
                ? "bg-gray-300 text-gray-600"
                : index <= currentStepIndex
                ? "bg-blue-300 text-blue-600"
                : "bg-gray-300 text-gray-600"
      
              )}
            >
              {index + 1}
            </div>
            <span className="mt-2 text-sm">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("All Orders");
  const [filterDate, setFilterDate] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);

  const parseDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
      return date;
    } catch (error) {
      console.error("Date parsing error:", error);
      return null;
    }
  };

  const userOrders = async () => {
    const result = await getUserOrdersService();

    if (result.success) {
      console.log("orders: ", result.data.orders);
      setOrders(result.data.orders);
    } else {
      console.log("No Orders found");
    }
  };

  useEffect(() => {
    userOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchTab =
      activeTab === "All Orders" ||
      (activeTab === "On Review" && order.delivery_status === "Pending") ||
      (activeTab === "Shipped" && order.delivery_status === "Shipped") ||
      (activeTab === "Delivered" && order.delivery_status === "Delivered");

    const formatDate = (dateStr: string) => parseDate(dateStr)?.toISOString().split("T")[0];

    const matchDate = filterDate ? formatDate(order.createdAt) === filterDate : true;

    return matchTab && matchDate;
  });

  const latestOrder = filteredOrders[0];

  let currentStepIndex = statusSteps.findIndex(
    (step) => step.toLowerCase() === latestOrder?.delivery_status.toLowerCase()
  );

  // Ensure currentStepIndex is never -1 (case of invalid status)
  if (currentStepIndex === -1 || !latestOrder) {
    currentStepIndex = 0; // Default to "Order Review"
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="shadow-lg rounded-2xl p-6 bg-white space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>

        <OrderProgress currentStepIndex={currentStepIndex} noOrder={!latestOrder} />


        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-700">
          <div>
            <strong>Order ID:</strong> {latestOrder?._id}
          </div>
          <div>
            <strong>Order Date:</strong>{" "}
            {latestOrder && parseDate(latestOrder.createdAt)
              ? parseDate(latestOrder.createdAt)?.toLocaleDateString()
              : "Invalid Date"}
          </div>
          <div>
            <strong>Delivery Address:</strong> {latestOrder && latestOrder.delivery_address}
          </div>
          <div>
            <strong>Delivery Date:</strong>{" "}
            {latestOrder && parseDate(latestOrder.delivery_date)
              ? parseDate(latestOrder.delivery_date)?.toLocaleDateString()
              : "Invalid Date"}
          </div>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition",
                activeTab === tab
                  ? "bg-blue-300 text-blue-800"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <hr className="w-full text-gray-300" />

        <div className="flex justify-end mb-4">
          <div className="flex flex-col items-end gap-1">
            <label className="text-sm font-semibold text-gray-700">Latest Order Date</label>
            <input
              type="date"
              value={
                filterDate ||
                (latestOrder && parseDate(latestOrder.createdAt)?.toISOString().split("T")[0]) ||
                ""
              }
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={order.products[0].productImage}
                    alt={order.products[0].productName}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{order.products[0].productName}</h3>
                    <p className="text-sm text-gray-600 mt-2">Quantity: {order.products[0].quantity_buyed}</p>
                    <p className="text-sm text-gray-600 mt-2">Price: ₹{order.amount}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Ordered On:{" "}
                      {parseDate(order.createdAt)
                        ? parseDate(order.createdAt)?.toLocaleDateString()
                        : "Invalid Date"}
                    </p>
                    <p
                      className={cn(
                        "text-sm font-medium mt-2 inline-block px-3 py-1 rounded-full",
                        order.delivery_status === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.delivery_status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                      )}
                    >
                      {order.delivery_status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredOrders.length === 0 && (
            <p className="text-center text-gray-500 text-sm">No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
