import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaComment, FaPaperPlane } from "react-icons/fa";
import { toast } from "sonner";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const result = await response.json();
      if (result.status === "success") {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Get in Touch
        </h2>
        <p className="text-gray-600 text-center mb-8">
          We'd love to hear from you. Fill out the form below, and we'll get back to you soon!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FaUser className="mr-2 text-blue-500" />
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FaEnvelope className="mr-2 text-blue-500" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FaComment className="mr-2 text-blue-500" />
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                errors.message ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Your message"
            ></textarea>
            {errors.message && (
              <p className="mt-1 text-sm text-red-500">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <FaPaperPlane className="mr-2" />
                Send Message
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;