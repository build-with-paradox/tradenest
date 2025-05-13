import React from "react";
import { motion } from "framer-motion";

const DeliveryLoader: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <motion.div
        className="relative flex items-center space-x-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Delivery truck image with animation */}
        <motion.img
          src="/assets/delivery.gif" 
          alt="Delivery truck loader"
          className="w-12 h-12"
          animate={{ x: ["-100%", "0%", "100%"], opacity: [0, 1, 0] }} // Animate truck moving across the screen
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 2,
            ease: "easeInOut",
          }}
        />
        
        {/* Roadline */}
        <div className="absolute bottom-0 left-0 w-32 h-1 bg-gray-600 rounded-t-lg"></div>
      </motion.div>
    </div>
  );
};

export default DeliveryLoader;
