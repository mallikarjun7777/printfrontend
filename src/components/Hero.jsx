import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-primary text-light">
      <div className="flex flex-col md:flex-row items-stretch min-h-screen">
        
        {/* Text content */}
        <motion.div 
          className="flex-1 flex flex-col justify-center px-6 md:px-12"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
            Use <span className="text-secondary">PrintXchange</span> and save time.
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Your prints. Our priority. Done right, every time.
          </p>
          <button
            onClick={() => navigate("/user/login")}
            className="bg-secondary text-dark font-semibold px-6 py-3 rounded-lg hover:bg-accent transition"
          >
            Get Started
          </button>
        </motion.div>

        {/* Image covering entire right half */}
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://www.brightsea.co.uk/wp-content/uploads/Green-1.png"
            alt="PrintXchange"
            className="w-full h-full object-cover"
          />
        </motion.div>

      </div>
    </section>
  );
}
