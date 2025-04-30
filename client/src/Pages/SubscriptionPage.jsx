import React, { useState, useEffect } from "react";
import { useAuth } from "../Store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID; // Add to .env

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(false);
  const { user, authorizationToken, subscribed, setSubscribed, getSubscriptionStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (subscribed) {
      navigate("/student-dashboard");
    }
  }, [subscribed, navigate]);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Load Razorpay SDK
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = async () => {
        try {
          // Create order
          const orderResponse = await fetch(`${backendUrl}/api/students/create-order`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authorizationToken,
            },
          });
          const orderData = await orderResponse.json();
          if (!orderResponse.ok) {
            throw new Error(orderData.message || "Failed to create order");
          }

          const options = {
            key: RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Education Platform",
            description: "Monthly Subscription",
            order_id: orderData.orderId,
            handler: async (response) => {
              try {
                // Verify payment
                const verifyResponse = await fetch(`${backendUrl}/api/students/verify-payment`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                  },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                });
                const verifyData = await verifyResponse.json();
                if (!verifyResponse.ok) {
                  throw new Error(verifyData.message || "Payment verification failed");
                }

                setSubscribed(true);
                toast.success("Payment successful! Redirecting to dashboard...");
                navigate("/student-dashboard");
              } catch (error) {
                console.error("Payment verification error:", error);
                toast.error(error.message);
              }
            },
            prefill: {
              name: user?.childrenName || "",
              email: user?.email || "",
              contact: user?.parentMobileNumber || "",
            },
            theme: {
              color: "#2563eb",
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on("payment.failed", (response) => {
            toast.error("Payment failed. Please try again.");
            console.error("Payment failed:", response.error);
          });
          rzp.open();
        } catch (error) {
          console.error("Order creation error:", error);
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };

      script.onerror = () => {
        toast.error("Failed to load Razorpay SDK.");
        setLoading(false);
      };
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-6 text-center"
          variants={itemVariants}
        >
          Choose Your Subscription Plan
        </motion.h2>

        <motion.div
          className="border border-gray-200 rounded-xl p-6 bg-gray-50"
          variants={itemVariants}
        >
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">Monthly Plan</h3>
          <p className="text-4xl font-bold text-gray-800 mb-4">₹100 <span className="text-sm font-normal text-gray-500">/month</span></p>
          <p className="text-gray-600 mb-6">Unlock full access to our educational platform with a monthly subscription.</p>
          <ul className="space-y-3 mb-6">
            {[
              "Access to all educational projects",
              "AI-powered learning assistant",
              "Parent communication tools",
              "Personalized learning dashboard",
            ].map((feature, index) => (
              <motion.li
                key={index}
                className="flex items-center text-gray-700"
                variants={itemVariants}
              >
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                {feature}
              </motion.li>
            ))}
          </ul>
          <motion.button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 transition-all duration-300 flex items-center justify-center shadow-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            variants={itemVariants}
          >
            {loading ? (
              <RotatingLines
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                width="24"
                visible={true}
              />
            ) : (
              <>
                <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                Proceed to Payment
              </>
            )}
          </motion.button>
        </motion.div>

        <motion.p
          className="text-center text-sm text-gray-600 mt-6"
          variants={itemVariants}
        >
          Need help?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Contact Support
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SubscriptionPage;