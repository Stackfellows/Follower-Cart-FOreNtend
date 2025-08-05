import React, { useState, useEffect } from "react";
import {
  User,
  ShoppingBag,
  Clock,
  TrendingUp,
  Package,
  CreditCard,
  Loader2, // For loading spinner
  Info, // For empty state icon
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "react-toastify"; // Import toast for notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

// IMPORTANT: This rate is an example. For a real application,
// fetch real-time exchange rates from a reliable API to ensure accuracy.
const USD_TO_PKR_RATE = 278; // Example fixed rate (as of July 2025).

const ClientDashboard = ({ user, setUser }) => {
  // Destructure setUser from props
  const [activeTab, setActiveTab] = useState("overview");
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);

  // New state for profile form fields
  const [fullName, setFullName] = useState(user?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const [stats, setStats] = useState([
    {
      label: "Total Orders",
      value: "0",
      icon: <ShoppingBag className="h-6 w-6" />,
      color: "text-blue-600",
    },
    {
      label: "Total Spent",
      value: "PKR 0.00", // Initial display with PKR
      icon: <CreditCard className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      label: "Active Orders",
      value: "0",
      icon: <Clock className="h-6 w-6" />,
      color: "text-orange-600",
    },
    {
      label: "Completed",
      value: "0",
      icon: <Package className="h-6 w-6" />,
      color: "text-purple-600",
    },
  ]);

  // Effect to update profile form fields when user prop changes
  useEffect(() => {
    setFullName(user?.name || "");
    setPhoneNumber(user?.phoneNumber || "");
  }, [user]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      // Input validation: Ensure user and user.email are available
      if (!user || !user.email) {
        setErrorOrders("User email not available. Please log in again.");
        setLoadingOrders(false);
        setUserOrders([]); // Ensure orders are cleared if no user
        setStats((prevStats) => [
          // Reset stats as well
          { ...prevStats[0], value: "0" },
          { ...prevStats[1], value: "PKR 0.00" },
          { ...prevStats[2], value: "0" },
          { ...prevStats[3], value: "0" },
        ]);
        return;
      }

      setLoadingOrders(true); // Start loading
      setErrorOrders(null); // Clear previous errors

      try {
        console.log(`Fetching orders for email: ${user.email}`);

        // Making the API call to your backend
        const response = await axios.get(
          `http://localhost:5000/followerApi/userOrders/${user.email}`
        );

        // IMPORTANT FIX: Access response.data.orders as the backend sends it
        const fetchedOrders = response.data.orders || [];
        console.log("Fetched user orders:", fetchedOrders);
        setUserOrders(fetchedOrders);

        // --- Calculate and update dashboard statistics ---
        const totalOrders = fetchedOrders.length;

        // Calculate total spent by converting each order's price to PKR
        // IMPORTANT FIX: Parse the price string (e.g., "PKR 1234.00") before calculation
        const totalSpentPKR = fetchedOrders
          .reduce(
            (sum, order) =>
              sum + (parseFloat(order.price?.replace("PKR ", "")) || 0),
            0
          )
          .toFixed(2); // Keep it fixed to 2 decimal places

        const activeOrders = fetchedOrders.filter(
          (order) =>
            order.status === "In Progress" || order.status === "Pending"
        ).length;
        const completedOrders = fetchedOrders.filter(
          (order) => order.status === "Completed"
        ).length;

        // Update the stats state with calculated values
        setStats((prevStats) => [
          { ...prevStats[0], value: totalOrders.toString() },
          { ...prevStats[1], value: `PKR ${totalSpentPKR}` }, // Display in PKR
          { ...prevStats[2], value: activeOrders.toString() },
          { ...prevStats[3], value: completedOrders.toString() },
        ]);
      } catch (err) {
        console.error("Error fetching user orders:", err);
        // Handle different types of errors (e.g., network, server response)
        setErrorOrders(
          err.response?.data?.msg ||
            "Failed to fetch your orders. Please try again."
        );
        setUserOrders([]); // Clear orders on error
        // Reset stats to zero or default on error
        setStats((prevStats) => [
          { ...prevStats[0], value: "0" },
          { ...prevStats[1], value: "PKR 0.00" }, // Reset with PKR
          { ...prevStats[2], value: "0" },
          { ...prevStats[3], value: "0" },
        ]);
      } finally {
        setLoadingOrders(false); // End loading regardless of success or failure
      }
    };

    fetchUserOrders();
  }, [user]); // Dependency array: Re-run effect if 'user' object changes

  // Handler for profile update submission
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileError(null);

    // Basic validation
    if (!fullName.trim() || !phoneNumber.trim()) {
      setProfileError("Full Name and Phone Number cannot be empty.");
      toast.error("Full Name and Phone Number cannot be empty.");
      setUpdatingProfile(false);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/followerApi/updateUser/${user.email}`, // Assuming your backend has an update endpoint by email
        {
          name: fullName,
          phoneNumber: phoneNumber,
        }
      );

      // Assuming your backend sends back the updated user data
      const updatedUserData = response.data.user;
      setUser(updatedUserData); // Update the user state in the parent component
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage =
        err.response?.data?.msg ||
        "Failed to update profile. Please try again.";
      setProfileError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Helper function to determine badge styling based on order status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || "Client"}!
              </h1>
              <p className="text-gray-600">
                Manage your orders and track your social media growth.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className={`${stat.color} mr-4`}>{stat.icon}</div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Section (Overview, Order History, Profile) */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {[
                {
                  id: "overview",
                  name: "Overview",
                  icon: <TrendingUp className="h-5 w-5" />,
                },
                {
                  id: "orders",
                  name: "Order History",
                  icon: <ShoppingBag className="h-5 w-5" />,
                },
                {
                  id: "profile",
                  name: "Profile",
                  icon: <User className="h-5 w-5" />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab Content */}
            {activeTab === "overview" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Account Overview
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Activity
                    </h3>
                    {loadingOrders ? (
                      <div className="flex justify-center items-center h-24">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                        <span className="ml-2 text-gray-600">
                          Loading orders...
                        </span>
                      </div>
                    ) : errorOrders ? (
                      <div className="text-center text-red-600 py-8 flex flex-col items-center">
                        <Info className="h-10 w-10 mb-2" />
                        <p>{errorOrders}</p>
                      </div>
                    ) : userOrders.length === 0 ? (
                      <div className="text-center text-gray-500 py-8 flex flex-col items-center">
                        <Info className="h-10 w-10 mb-2" />
                        <p>No recent orders found.</p>
                        <p className="mt-2">Place an order to see it here!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userOrders.slice(0, 3).map((order) => (
                          <div
                            key={order.id} // Use order.id (mapped from _id)
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <div className="font-medium text-gray-900">
                                {order.service}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.amount} - {/* Use order.amount */}
                                {order.date} {/* Use order.date */}
                              </div>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-4">
                      <button
                        onClick={() => navigate("/order")} // Navigate to the Order page
                        className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
                      >
                        <div className="font-medium text-purple-600">
                          Buy New Services
                        </div>
                        <div className="text-sm text-purple-500">
                          Explore our social media services
                        </div>
                      </button>
                      <button
                        onClick={() => navigate("/track-order")} // Navigate to the Track Order page
                        className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      >
                        <div className="font-medium text-blue-600">
                          Track Order
                        </div>
                        <div className="text-sm text-blue-500">
                          Monitor your order progress
                        </div>
                      </button>
                      <button
                        onClick={() => navigate("/contact")} // Navigate to a Contact page (assuming it exists)
                        className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
                      >
                        <div className="font-medium text-green-600">
                          Contact Support
                        </div>
                        <div className="text-sm text-green-500">
                          Get help with your account
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order History Tab Content */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order History
                </h2>
                {loadingOrders ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                    <span className="ml-4 text-lg text-gray-600">
                      Loading your order history...
                    </span>
                  </div>
                ) : errorOrders ? (
                  <div className="text-center text-red-600 py-16 flex flex-col items-center">
                    <Info className="h-12 w-12 mb-4" />
                    <p className="text-lg">{errorOrders}</p>
                    <p className="text-md text-gray-500 mt-2">
                      Please try again later.
                    </p>
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="text-center text-gray-500 py-16 flex flex-col items-center">
                    <Info className="h-12 w-12 mb-4" />
                    <p className="text-lg">
                      You haven't placed any orders yet.
                    </p>
                    <p className="text-md mt-2">
                      Start by exploring our services!
                    </p>
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
                            Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price (PKR) {/* Updated table header */}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            {" "}
                            {/* Use order.id */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order.id.substring(0, 8)}...{" "}
                              {/* Use order.id */}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.service}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.amount} {/* Use order.amount */}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.date} {/* Use order.date */}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.price}{" "}
                              {/* order.price is already formatted as "PKR XXX" */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab Content */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Profile Settings
                </h2>
                <div className="max-w-md">
                  <form className="space-y-6" onSubmit={handleProfileUpdate}>
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        disabled={updatingProfile} // Disable while updating
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="emailAddress"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="emailAddress"
                        defaultValue={user?.email || ""}
                        readOnly
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        placeholder="+1 (555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        disabled={updatingProfile} // Disable while updating
                      />
                    </div>
                    {profileError && (
                      <p className="text-red-600 text-sm">{profileError}</p>
                    )}
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
                      disabled={updatingProfile} // Disable button while updating
                    >
                      {updatingProfile && (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      )}
                      {updatingProfile ? "Updating..." : "Update Profile"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
