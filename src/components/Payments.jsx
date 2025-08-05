import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  Clock,
  Info,
  Loader2,
  Eye, // For viewing screenshot
  Edit, // For editing status
  Save, // For saving status
  Ban, // For cancelling
} from "lucide-react";

const Payments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null); // State to track which order is being edited
  const [newStatus, setNewStatus] = useState(""); // State for new status when editing

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all orders from your backend
      const response = await axios.get(
        "https://follower-cart-bacend1.onrender.com/followerApi/getOrders"
      );
      // Filter orders that have payment details or are pending
      const paymentsData = response.data.filter(
        (order) => order.paymentMethod && order.paymentScreenshotUrl
      );
      setOrders(paymentsData);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to fetch payment data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId) => {
    if (!newStatus) {
      alert("Please select a new status."); // Replace with a custom modal in a real app
      return;
    }
    try {
      await axios.patch(
        `https://follower-cart-bacend1.onrender.com/followerApi/updateOrder/${orderId}`,
        {
          status: newStatus,
        }
      );
      alert("Order status updated successfully!"); // Replace with a custom modal
      setEditingOrderId(null); // Exit editing mode
      setNewStatus(""); // Clear new status
      fetchOrders(); // Re-fetch orders to update the list
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status. Please try again."); // Replace with a custom modal
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
        <p className="ml-4 text-gray-600">Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg shadow-md">
        <XCircle className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Error Loading Payments</h3>
        <p>{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Manage Payments</h2>
      {orders.length === 0 ? (
        <div className="text-center p-8 bg-blue-50 text-blue-700 rounded-lg">
          <Info className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg">No payment records found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price (PKR)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Screenshot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order._id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.requiredFollowers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    PKR {parseFloat(order.price).toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.paymentDetails}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.paymentScreenshotUrl ? (
                      <a
                        href={order.paymentScreenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingOrderId === order._id ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        >
                          <option value="">Select Status</option>
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Refunded">Refunded</option>
                          <option value="Failed">Failed</option>
                        </select>
                        <button
                          onClick={() => handleStatusUpdate(order._id)}
                          className="text-green-600 hover:text-green-900"
                          title="Save Status"
                        >
                          <Save className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingOrderId(null);
                            setNewStatus("");
                          }}
                          className="text-gray-600 hover:text-gray-900"
                          title="Cancel"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingOrderId(order._id);
                          setNewStatus(order.status);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                        title="Edit Status"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;
