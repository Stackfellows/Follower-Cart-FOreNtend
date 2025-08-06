import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye, // For View Details
  Repeat, // For Reorder
  Ban, // For Cancel
  DollarSign, // For Refunded status icon
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Order = ({ user }) => {
  // Accept user prop
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [actionMessage, setActionMessage] = useState(null); // For success/error messages after actions

  const navigate = useNavigate(); // Initialize useNavigate

  // Function to fetch orders from backend
  const fetchOrders = async () => {
    if (!user || !user.email) {
      // If no user is logged in, or email is missing, clear orders and stop loading
      setOrders([]);
      setLoading(false);
      setActionMessage({
        type: "info",
        text: "Please log in to view your orders.",
      });
      return;
    }

    try {
      setLoading(true);
      // IMPORTANT CHANGE: Call userOrders API with the logged-in user's email
      const response = await axios.get(
        `https://follower-cart-backend02.onrender.com/followerApi/userOrders/${user.email}`
      );
      setOrders(response.data.orders || []);
      setActionMessage(null); // Clear messages on successful fetch
    } catch (error) {
      console.error("Error fetching user orders:", error);
      setOrders([]);
      if (error.response && error.response.status === 404) {
        setActionMessage({
          type: "info",
          text: "No orders found for your account.",
        });
      } else {
        setActionMessage({
          type: "error",
          text: "Failed to load your orders. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]); // Re-fetch orders when the user object changes (e.g., after login/logout)

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "In Progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "Pending":
        return <Package className="h-5 w-5 text-yellow-500" />;
      case "Cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "Refunded": // Added refunded status
        return <DollarSign className="h-5 w-5 text-gray-500" />;
      case "Failed": // Added failed status
        return <XCircle className="h-5 w-5 text-red-700" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
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

  const filteredOrders = orders.filter((order) => {
    const id = order.id ? order.id.toString() : "";
    const service = order.service ? order.service.toLowerCase() : "";
    const matchesSearch =
      id.includes(searchTerm) || service.includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- Action Handlers ---

  const handleViewDetails = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  const handleReorder = (order) => {
    // Navigate to the BuyNow page and pass order details as state
    navigate("/buy", {
      state: {
        reorderData: {
          name: order.name,
          email: order.email,
          phoneNumber: order.phoneNumber,
          postLink: order.postLink,
          profileLink: order.profileLink,
          requiredFollowers: order.amount, // Use 'amount' from formatted order
          platform: order.platform,
          socialId: order.socialId,
          service: order.service,
        },
      },
    });
  };

  const confirmCancelOrder = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    setShowCancelModal(false); // Close modal immediately
    setActionMessage(null); // Clear previous action messages

    try {
      const response = await axios.patch(
        `https://follower-cart-backend02.onrender.com/followerApi/updateOrder/${orderToCancel.id}`,
        { status: "Cancelled" }
      );
      console.log("Order cancelled:", response.data);
      setActionMessage({
        type: "success",
        text: `Order ${orderToCancel.id.substring(
          0,
          8
        )}... has been cancelled.`,
      });
      fetchOrders(); // Re-fetch orders to update the list
    } catch (error) {
      console.error("Error cancelling order:", error);
      setActionMessage({
        type: "error",
        text: `Failed to cancel order ${orderToCancel.id.substring(
          0,
          8
        )}.... Please try again.`,
      });
    } finally {
      setOrderToCancel(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 animate-bounce" />
          <p className="text-gray-600 mt-4">Loading orders...</p>
        </div>
      </div>
    );
  }

  // Display message if no user is logged in
  if (!user || !user.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600 mb-6">
            Please log in to view your orders.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center mx-auto"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Management
          </h1>
          <p className="text-xl text-gray-600">
            Track and manage all your orders in one place
          </p>
        </div>

        {actionMessage && (
          <div
            className={`flex items-center justify-center p-4 rounded-lg text-white font-semibold mb-4 ${
              actionMessage.type === "success"
                ? "bg-green-500"
                : actionMessage.type === "info"
                ? "bg-blue-500"
                : "bg-red-500"
            }`}
          >
            {actionMessage.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 mr-2" />
            )}
            {actionMessage.text}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <h3 className="ml-2 text-lg font-semibold text-gray-900">
                      Order #{order.id.substring(0, 8)}...
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {order.service}
                  </h4>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Platform: {order.platform}</span>
                    <span>Amount: {order.amount}</span>
                  </div>
                </div>

                {order.status === "In Progress" && (
                  <div className="mb-4">
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

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <span className="text-gray-500">Start Time:</span>
                    <div className="font-medium text-gray-900">
                      {order.startTime}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Completion:</span>
                    <div className="font-medium text-gray-900">
                      {order.completionTime}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Order Date:</span>
                    <div className="font-medium text-gray-900">
                      {order.date}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <div className="font-medium text-purple-600">
                      {order.price}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleViewDetails(order.id)}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-1" /> View Details
                  </button>
                  {order.status === "Completed" && (
                    <button
                      onClick={() => handleReorder(order)}
                      className="flex-1 border border-purple-600 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors duration-200 flex items-center justify-center"
                    >
                      <Repeat className="h-4 w-4 mr-1" /> Reorder
                    </button>
                  )}
                  {/* Only show cancel button if the order belongs to the current user and is pending */}
                  {user &&
                    order.email === user.email &&
                    order.status === "Pending" && (
                      <button
                        onClick={() => confirmCancelOrder(order)}
                        className="flex-1 border border-red-600 text-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center justify-center"
                      >
                        <Ban className="h-4 w-4 mr-1" /> Cancel
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && actionMessage?.type !== "info" && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or place your first order.
            </p>
          </div>
        )}

        {/* Order Summary */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {orders.filter((o) => o.status === "Completed").length}
              </div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {orders.filter((o) => o.status === "In Progress").length}
              </div>
              <div className="text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {orders.filter((o) => o.status === "Pending").length}
              </div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {/* Ensure price is parsed correctly before summing */}
                PKR{" "}
                {orders
                  .reduce(
                    (sum, order) =>
                      sum + (parseFloat(order.price?.replace("PKR ", "")) || 0),
                    0
                  )
                  .toFixed(2)}
              </div>
              <div className="text-gray-600">Total Spent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Confirm Cancellation
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel order #
              {orderToCancel?.id.substring(0, 8)}...? This action cannot be
              undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                No, Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
