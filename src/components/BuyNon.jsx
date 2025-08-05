import React, { useState } from "react";
import { Users, Star, Shield, Clock } from "lucide-react";

const BuyNon = ({ service, platform }) => {
  const [customAmount, setCustomAmount] = useState(1000);
  const [profileLink, setProfileLink] = useState("");

  const basePrice = 0.005; // Base price per unit

  const calculatePrice = (amount) => {
    let price = amount * basePrice;

    // Volume discounts
    if (amount >= 10000) price *= 0.7;
    else if (amount >= 5000) price *= 0.8;
    else if (amount >= 1000) price *= 0.9;

    return Math.max(price, 2.99); // Minimum price
  };

  const handleCustomPurchase = async () => {
    try {
      const price = calculatePrice(customAmount);

      // Prepare order data
      const orderData = {
        name: "John Doe", // Replace with user input if needed
        email: "johndoe@example.com", // Replace with user input if needed
        phoneNumber: "1234567890", // Replace with user input if needed
        postLink: "https://example.com/post", // Optional
        profileLink: profileLink, // From input
        requiredFollowers: customAmount,
        platform: platform,
        socialId: "social123", // Optional
        service: service,
      };

      const response = await fetch(
        "https://follower-cart-bacend1.onrender.com/followerApi/createOrder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(`Order placed successfully! Order ID: ${data.id}`);
      } else {
        const errorData = await response.json();
        alert(`Order failed: ${errorData.msg}`);
      }
    } catch (error) {
      console.error("Order creation error:", error);
      alert("An error occurred while placing the order.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Custom {platform} {service}
        </h3>
        <p className="text-gray-600">Non-drop guarantee with premium quality</p>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Enter Custom Amount
        </label>
        <div className="relative">
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(parseInt(e.target.value) || 1000)}
            min="100"
            max="1000000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg font-semibold"
          />
          <div className="absolute right-3 top-3 text-gray-400">{service}</div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-3xl font-bold text-purple-600">
            ${calculatePrice(customAmount).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            ${((calculatePrice(customAmount) / customAmount) * 1000).toFixed(3)}{" "}
            per 1K
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {platform} Username/URL
        </label>
        <input
          type="text"
          placeholder={`Enter your ${platform} username or URL`}
          value={profileLink}
          onChange={(e) => setProfileLink(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 text-center text-xs">
        <div className="flex flex-col items-center">
          <Shield className="h-6 w-6 text-green-500 mb-1" />
          <span className="text-gray-600">Non-Drop</span>
        </div>
        <div className="flex flex-col items-center">
          <Star className="h-6 w-6 text-yellow-500 mb-1" />
          <span className="text-gray-600">Premium</span>
        </div>
        <div className="flex flex-col items-center">
          <Clock className="h-6 w-6 text-blue-500 mb-1" />
          <span className="text-gray-600">Fast Delivery</span>
        </div>
      </div>

      <button
        onClick={handleCustomPurchase}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
      >
        Order Custom Package - ${calculatePrice(customAmount).toFixed(2)}
      </button>

      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <div className="text-center text-xs text-yellow-800">
          <p>
            <strong>Non-Drop Guarantee:</strong> We replace any drops for 30
            days
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuyNon;
