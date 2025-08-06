import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  ArrowLeft,
  Loader2,
  DollarSign,
  Repeat, // Added Repeat icon for Reorder button
  Ban, // Added Ban icon for Cancel button
} from "lucide-react";

const OrderDetails = ({ user }) => {
  const { orderId } = useParams(); // Get orderId from URL parameters
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("OrderDetails: useEffect triggered.");
    console.log("OrderDetails: User prop received:", user); // DEBUG LOG

    const fetchOrderDetails = async () => {
      if (!user || !user.email) {
        console.log(
          "OrderDetails: User or user.email is missing, showing access denied."
        ); // DEBUG LOG
        setError("Access Denied: Please log in to view order details."); // More specific error message
        setLoading(false);
        return;
      }
      if (!orderId) {
        console.log("OrderDetails: Order ID is missing from URL."); // DEBUG LOG
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log(
          `OrderDetails: Attempting to fetch order ${orderId} for user ${user.email}`
        ); // DEBUG LOG
        const response = await axios.get(
          `https://follower-cart-backend02.onrender.com/followerApi/getOrder/${orderId}`
        );
        const fetchedOrder = response.data;
        console.log("OrderDetails: Raw fetched order data:", fetchedOrder); // DEBUG LOG

        // IMPORTANT: Add a check to ensure the fetched order belongs to the logged-in user
        // Or if the logged-in user is an admin.
        if (fetchedOrder.email !== user.email && user.role !== "admin") {
          setError(
            "Access Denied: You do not have permission to view this order."
          );
          setOrder(null);
          setLoading(false);
          return;
        }

        // Re-apply the formatting logic from Order.jsx's fetchOrders
        const orderDate = fetchedOrder.createdAt
          ? new Date(fetchedOrder.createdAt)
          : new Date();
        let progress = 0;
        let startTime = "N/A";
        let completionTime = "N/A";

        if (fetchedOrder.status === "In Progress") {
          progress = 50; // Mock progress for in-progress orders
          startTime = orderDate.toLocaleString(); // Use order creation time as start time
        } else if (fetchedOrder.status === "Completed") {
          progress = 100;
          startTime = orderDate.toLocaleString();
          completionTime = new Date(
            orderDate.getTime() + 2 * 60 * 60 * 1000
          ).toLocaleString(); // Mock completion 2 hours after start
        }

        const numericPrice =
          typeof fetchedOrder.price === "number" ? fetchedOrder.price : 0;

        setOrder({
          id: fetchedOrder._id,
          orderId: fetchedOrder._id, // Use _id as orderId for display
          name: fetchedOrder.name || "N/A",
          email: fetchedOrder.email || "N/A",
          phoneNumber: fetchedOrder.phoneNumber || "N/A",
          postLink: fetchedOrder.postLink || "N/A",
          profileLink: fetchedOrder.profileLink || "N/A",
          amount: fetchedOrder.requiredFollowers || "N/A",
          platform: fetchedOrder.platform || "N/A",
          socialId: fetchedOrder.socialId || "N/A",
          service: fetchedOrder.service || "N/A",
          price: `PKR ${numericPrice.toFixed(0)}`, // Format price for display
          status: fetchedOrder.status || "Pending",
          date: orderDate.toLocaleDateString(),
          startTime: startTime,
          completionTime: completionTime,
          progress: progress,
          paymentMethod: fetchedOrder.paymentMethod || "N/A",
          paymentDetails: fetchedOrder.paymentDetails || "N/A",
          paymentScreenshotUrl: fetchedOrder.paymentScreenshotUrl || "",
        });
      } catch (err) {
        console.error("OrderDetails: Error fetching order details:", err); // DEBUG LOG
        setError("Failed to load order details. Please try again.");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, user]); // Re-fetch if orderId or user changes

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "In Progress":
        return <Clock className="h-6 w-6 text-blue-500" />;
      case "Pending":
        return <Package className="h-6 w-6 text-yellow-500" />;
      case "Cancelled":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "Refunded":
        return <DollarSign className="h-6 w-6 text-gray-500" />;
      case "Failed":
        return <XCircle className="h-6 w-6 text-red-700" />;
      default:
        return <Package className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Refunded":
        return "bg-gray-200 text-gray-800";
      case "Failed":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto text-purple-500 animate-spin" />
          <p className="text-gray-600 mt-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/order")}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <Info className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            The order you are looking for does not exist or you do not have
            permission to view it.
          </p>
          <button
            onClick={() => navigate("/order")}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/order")}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to All Orders
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              {getStatusIcon(order.status)}
              <h1 className="ml-3 text-3xl font-bold text-gray-900">
                Order Details
              </h1>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          <p className="text-gray-600 text-lg mb-4">
            Order ID:{" "}
            <span className="font-semibold text-gray-800">{order.orderId}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 mb-8">
            <div>
              <p>
                <span className="font-semibold">Service:</span> {order.service}
              </p>
              <p>
                <span className="font-semibold">Platform:</span>{" "}
                {order.platform}
              </p>
              <p>
                <span className="font-semibold">Amount:</span> {order.amount}
              </p>
              <p>
                <span className="font-semibold">Price:</span>{" "}
                <span className="text-purple-600">{order.price}</span>
              </p>
              <p>
                <span className="font-semibold">Order Date:</span> {order.date}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Client Name:</span> {order.name}
              </p>
              <p>
                <span className="font-semibold">Client Email:</span>{" "}
                {order.email}
              </p>
              <p>
                <span className="font-semibold">Phone Number:</span>{" "}
                {order.phoneNumber}
              </p>
              {order.socialId && order.socialId !== "N/A" && (
                <p>
                  <span className="font-semibold">Social ID:</span>{" "}
                  {order.socialId}
                </p>
              )}
              <p>
                <span className="font-semibold">Profile Link:</span>{" "}
                <a
                  href={order.profileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {order.profileLink}
                </a>
              </p>
              {order.postLink && order.postLink !== "N/A" && (
                <p>
                  <span className="font-semibold">Post Link:</span>{" "}
                  <a
                    href={order.postLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {order.postLink}
                  </a>
                </p>
              )}
            </div>
          </div>

          {order.status === "In Progress" && (
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{order.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${order.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Timeline</h3>
              <p>
                <span className="font-semibold">Start Time:</span>{" "}
                {order.startTime}
              </p>
              <p>
                <span className="font-semibold">Completion Time:</span>{" "}
                {order.completionTime}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Payment Info
              </h3>
              <p>
                <span className="font-semibold">Method:</span>{" "}
                {order.paymentMethod}
              </p>
              <p>
                <span className="font-semibold">Details:</span>{" "}
                {order.paymentDetails}
              </p>
              {order.paymentScreenshotUrl &&
                order.paymentScreenshotUrl !== "" && (
                  <p>
                    <span className="font-semibold">Screenshot:</span>{" "}
                    <a
                      href={order.paymentScreenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Screenshot
                    </a>
                  </p>
                )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            {order.status === "Completed" && (
              <button
                onClick={() =>
                  navigate("/buy", { state: { reorderData: order } })
                }
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Repeat className="h-5 w-5 mr-2" /> Reorder This
              </button>
            )}
            {order.status === "Pending" &&
              user &&
              order.email === user.email && (
                <button
                  // You'll need a confirmCancelOrder function here if you want to allow cancellation from details page
                  // For simplicity, let's just navigate back to orders page or show a message.
                  // For a real app, you'd add a modal here too.
                  className="px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center"
                  onClick={() => {
                    // This would ideally trigger a modal and then an API call to cancel.
                    // For now, just a placeholder or navigate back.
                    alert(
                      "Cancellation functionality needs to be implemented here."
                    ); // Using alert for demo, replace with modal
                    navigate("/order"); // Changed to /order
                  }}
                >
                  <Ban className="h-5 w-5 mr-2" /> Cancel Order
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
