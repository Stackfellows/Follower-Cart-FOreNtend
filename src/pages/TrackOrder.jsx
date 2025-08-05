import React, { useEffect, useState } from "react";
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  Truck,
  Star,
  Info,
  XCircle,
} from "lucide-react"; // Added Info and XCircle for messages

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); // State for success/error messages

  // Function to generate dynamic timeline based on order status
  const generateOrderTimeline = (status, orderDateStr) => {
    const orderDate = new Date(orderDateStr);
    const timeline = [
      {
        status: "Order Placed",
        description: "Your order has been successfully placed.",
        icon: Package,
        time: orderDate.toLocaleString(),
        completed: false,
      },
      {
        status: "Processing",
        description: "Your order is being processed and prepared for delivery.",
        icon: Clock,
        time: "N/A", // Will be set dynamically
        completed: false,
      },
      {
        status: "In Progress",
        description:
          "Your service delivery has started. Watch your social media grow!",
        icon: Truck,
        time: "N/A", // Will be set dynamically
        completed: false,
      },
      {
        status: "Completed",
        description:
          "Your order has been completed successfully. Enjoy your new engagement!",
        icon: CheckCircle,
        time: "N/A", // Will be set dynamically
        completed: false,
      },
    ];

    // Mark steps as completed based on the current status
    let currentStepIndex = -1;
    switch (status) {
      case "Pending":
        currentStepIndex = 0;
        break;
      case "In Progress":
        currentStepIndex = 2; // "In Progress" is the 3rd step (index 2)
        break;
      case "Completed":
        currentStepIndex = 3; // "Completed" is the 4th step (index 3)
        break;
      case "Cancelled":
      case "Refunded":
      case "Failed":
        // For these statuses, only "Order Placed" is completed, then the final status is shown.
        // We can add a specific "Cancelled/Failed" step if needed.
        currentStepIndex = 0; // Only "Order Placed" is considered
        timeline.push({
          status: status,
          description: `Your order was ${status.toLowerCase()}. Please contact support for details.`,
          icon: XCircle,
          time: new Date().toLocaleString(), // Current time for cancellation/failure
          completed: true,
        });
        break;
      default:
        currentStepIndex = 0; // Default to order placed
        break;
    }

    for (let i = 0; i < timeline.length; i++) {
      if (i <= currentStepIndex) {
        timeline[i].completed = true;
        // Mock times for processing and in-progress steps if not provided by backend
        if (i === 1 && timeline[i].time === "N/A") {
          // Processing
          timeline[i].time = new Date(
            orderDate.getTime() + 15 * 60 * 1000
          ).toLocaleString(); // 15 mins after order
        } else if (i === 2 && timeline[i].time === "N/A") {
          // In Progress
          timeline[i].time = new Date(
            orderDate.getTime() + 30 * 60 * 1000
          ).toLocaleString(); // 30 mins after order
        } else if (i === 3 && timeline[i].time === "N/A") {
          // Completed
          timeline[i].time = new Date(
            orderDate.getTime() + 2 * 60 * 60 * 1000
          ).toLocaleString(); // 2 hours after order
        }
      }
    }

    return timeline;
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setOrderData(null);
    setMessage(null); // Clear previous messages

    try {
      const response = await fetch(
        `http://localhost:5000/followerApi/getOrder/${orderId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.msg || "Order not found or invalid Order ID."
        );
      }

      const data = await response.json();

      // Calculate progress percentage based on status
      let progressPercentage = 0;
      let estimatedCompletionTime = "N/A";
      const orderCreationDate = data.createdAt
        ? new Date(data.createdAt)
        : new Date();

      switch (data.status) {
        case "Pending":
          progressPercentage = 0;
          estimatedCompletionTime = "Within 24 hours";
          break;
        case "In Progress":
          progressPercentage = Math.floor(Math.random() * (90 - 30 + 1)) + 30; // Random between 30-90%
          estimatedCompletionTime = "Still in progress";
          break;
        case "Completed":
          progressPercentage = 100;
          estimatedCompletionTime = new Date(
            orderCreationDate.getTime() + 2 * 60 * 60 * 1000
          ).toLocaleString(); // Mock 2 hours after creation
          break;
        case "Cancelled":
        case "Refunded":
        case "Failed":
          progressPercentage = 0; // Or a specific value to indicate non-delivery
          estimatedCompletionTime = "Not applicable";
          break;
        default:
          progressPercentage = 0;
          estimatedCompletionTime = "N/A";
      }

      setOrderData({
        id: data._id || "N/A",
        service: data.service || "N/A",
        amount: data.requiredFollowers || "N/A", // Use 'requiredFollowers' from backend
        status: data.status || "Pending",
        progress: progressPercentage,
        orderDate: orderCreationDate.toLocaleDateString(),
        startTime: orderCreationDate.toLocaleString(),
        estimatedCompletion: estimatedCompletionTime,
        price: data.price
          ? `PKR ${parseFloat(data.price).toFixed(0)}`
          : "PKR 0", // Ensure price is formatted as PKR
        timeline: generateOrderTimeline(data.status, orderCreationDate), // Generate dynamic timeline
      });
      setMessage({
        type: "success",
        text: "Order details fetched successfully!",
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      setMessage({
        type: "error",
        text:
          error.message ||
          "Failed to fetch order. Please check the Order ID and try again.",
      });
      setOrderData(null); // Clear order data on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
              <Package className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-xl text-gray-600">
            Enter your Order ID to get real-time updates on your delivery
          </p>
        </div>

        {/* Track Order Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your Order ID (e.g., 65c9f9a0d8e8c8b4e7b2e3a1)" // Removed the JS comment within JSX attribute
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Tracking...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`flex items-center justify-center p-4 rounded-lg text-white font-semibold mb-4 ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        {/* Order Details */}
        {orderData && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Order #{orderData.id.substring(0, 8)}...
                  </h2>
                  <p className="text-purple-100">{orderData.service}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{orderData.price}</div>
                  <div className="text-purple-100">
                    {orderData.amount}{" "}
                    {orderData.service.includes("Followers")
                      ? "followers"
                      : "units"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Delivery Progress
                </h3>
                <span className="text-2xl font-bold text-purple-600">
                  {orderData.progress}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${orderData.progress}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Order Date:</span>
                  <div className="font-medium text-gray-900">
                    {orderData.orderDate}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Start Time:</span>
                  <div className="font-medium text-gray-900">
                    {orderData.startTime}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Est. Completion:</span>
                  <div className="font-medium text-gray-900">
                    {orderData.estimatedCompletion}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Order Timeline
              </h3>
              <div className="space-y-6">
                {orderData.timeline.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                        step.completed
                          ? "bg-green-100 text-green-600"
                          : index ===
                            orderData.timeline.findIndex((s) => !s.completed)
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : index ===
                        orderData.timeline.findIndex((s) => !s.completed) ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`font-medium ${
                            step.completed ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {step.status}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {step.time !== "N/A" ? step.time : ""}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-6">
              <div className="flex items-center">
                <Truck className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-blue-900">
                    Order Status: {orderData.status}
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Your order is being processed and delivered. You'll receive
                    an email notification once completed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help?
            </h2>
            <p className="text-gray-600 mb-6">
              If you can't find your order or have questions about delivery, our
              support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200">
                Contact Support
              </button>
              <button className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors duration-200">
                View FAQ
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-yellow-50 rounded-2xl p-6">
          <h3 className="font-semibold text-yellow-900 mb-3 flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Tracking Tips
          </h3>
          <ul className="text-yellow-800 text-sm space-y-1">
            <li>• Use the correct Order ID from your confirmation email</li>
            <li>• Orders typically start processing within 15–30 minutes</li>
            <li>
              • Check your spam folder if you haven't received confirmation
            </li>
            <li>
              • Contact support if your order doesn't start within 2 hours
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
