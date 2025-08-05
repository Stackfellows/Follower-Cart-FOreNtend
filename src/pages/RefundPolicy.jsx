// RefundPolicy.jsx
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Send, Clock } from "lucide-react";

const RefundPolicy = () => {
  const [formData, setFormData] = useState({
    orderId: "",
    clientName: "",
    clientEmail: "",
    amount: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Reverted the API endpoint back to the localhost URL as requested.
      const res = await axios.post(
        "http://localhost:5000/followerApi/refundRequests",
        formData
      );
      toast.success(res.data.msg);
      // Clear form after successful submission
      setFormData({
        orderId: "",
        clientName: "",
        clientEmail: "",
        amount: "",
        reason: "",
      });
    } catch (error) {
      console.error("Refund submission error:", error);
      toast.error(
        error.response?.data?.msg ||
          "Failed to submit refund request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Refund Policy & Request Form
          </h1>
          <p className="mt-2 text-gray-500">
            Please fill out this form to request a refund.
          </p>
        </div>

        {/* Refund Policy Section */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Our Refund Policy
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
            <li>
              Refund requests must be made within 7 days of the purchase date.
            </li>
            <li>The item must be in its original, unused condition.</li>
            <li>
              Refunds are processed within 5-7 business days after approval.
            </li>
            <li>Shipping fees are non-refundable.</li>
            <li>
              We reserve the right to reject any refund request that does not
              meet the above conditions.
            </li>
          </ul>
        </div>

        {/* Refund Request Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="orderId"
              className="block text-sm font-medium text-gray-700"
            >
              Order ID
            </label>
            <input
              id="orderId"
              name="orderId"
              type="text"
              value={formData.orderId}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="clientName"
              className="block text-sm font-medium text-gray-700"
            >
              Your Name
            </label>
            <input
              id="clientName"
              name="clientName"
              type="text"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="clientEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Your Email
            </label>
            <input
              id="clientEmail"
              name="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Refund Amount (PKR)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700"
            >
              Reason for Refund
            </label>
            <textarea
              id="reason"
              name="reason"
              rows="4"
              value={formData.reason}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
          >
            {loading ? (
              <>
                <Clock className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Request
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RefundPolicy;
