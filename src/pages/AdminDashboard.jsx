import React, { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  User,
  Package,
  AlertCircle,
  BarChart3,
  Eye, // For View icon
  CheckCircle, // For Complete icon
  Loader2, // For In Progress icon (loading/spinner)
  Info, // For empty states/errors
  Ban, // For Cancel icon
  Clock, // For Pending icon
  XCircle, // For error action messages
  CreditCard, // New icon for Payment Details tab
  Edit, // NEW: For Edit User icon
  Trash2, // NEW: For Delete User icon
  Save, // NEW: For Save icon in edit modal
} from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Import toast for feedback
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

// Import Recharts components for graphs
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// IMPORTANT: This rate is an example. For a real application,
// fetch real-time exchange rates from a reliable API to ensure accuracy.
const USD_TO_PKR_RATE = 278; // Example fixed rate (as of July 2025).

const AdminDashboard = ({ user }) => {
  // State for active tab, order data, user data, and loading/error states
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [usersData, setUsersData] = useState([]);
  // New state for payments data
  const [paymentsData, setPaymentsData] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);
  // New loading and error states for payments
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [errorPayments, setErrorPayments] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false); // State for cancel confirmation modal
  const [orderToCancel, setOrderToCancel] = useState(null); // State to hold the order being cancelled
  const [actionMessage, setActionMessage] = useState(null); // For success/error messages after actions

  // State for payment action (approve/reject) confirmation modal
  const [showPaymentActionModal, setShowPaymentActionModal] = useState(false);
  const [paymentToUpdate, setPaymentToUpdate] = useState(null);
  const [paymentActionType, setPaymentActionType] = useState(""); // 'approve' or 'reject'

  // NEW: States for User Management Modals
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "user",
    isBanned: false,
    phoneNumber: "",
  });
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // NEW: States for Refund Requests
  const [refundRequests, setRefundRequests] = useState([]);
  const [loadingRefunds, setLoadingRefunds] = useState(false);
  const [errorRefunds, setErrorRefunds] = useState(null);
  const [showRefundActionModal, setShowRefundActionModal] = useState(false);
  const [refundToUpdate, setRefundToUpdate] = useState(null);
  const [refundActionType, setRefundActionType] = useState(""); // 'approve' or 'reject'
  const [refundAdminRemarks, setRefundAdminRemarks] = useState(""); // For admin remarks

  // --- Derived Stats (will be updated after data fetch) ---
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenuePKR, setTotalRevenuePKR] = useState("0.00");
  const [revenueGrowth, setRevenueGrowth] = useState("0.00"); // New state for revenue growth

  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [inProgressOrdersCount, setInProgressOrdersCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [cancelledOrdersCount, setCancelledOrdersCount] = useState(0);
  const [refundedOrdersCount, setRefundedOrdersCount] = useState(0);
  const [failedOrdersCount, setFailedOrdersCount] = useState(0);

  const [serviceDistribution, setServiceDistribution] = useState({});
  // FIX: Initialize revenueByService with useState({})
  const [revenueByService, setRevenueByService] = useState({});

  // Data for Recharts graphs
  const [orderStatusChartData, setOrderStatusChartData] = useState([]);
  const [revenueByServiceChartData, setRevenueByServiceChartData] = useState(
    []
  );

  // Helper function to format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle cases where dateString might be null or undefined

    try {
      const date = new Date(dateString);
      // Check if the date object is valid after parsing
      if (isNaN(date.getTime())) {
        return "Invalid Date"; // Return "Invalid Date" if parsing fails
      }

      const options = {
        year: "numeric",
        month: "short", // e.g., Oct
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // For AM/PM format
      };

      // Use 'en-US' or any locale that suits your audience
      return date.toLocaleDateString("en-US", options);
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date"; // Catch any unexpected errors during formatting
    }
  };

  // Helper function to get revenue for a specific month/year
  const getMonthlyRevenue = (ordersArray, year, month) => {
    return ordersArray.reduce((sum, order) => {
      // Use order.createdAt (ISO string) directly for date parsing
      const orderDate = new Date(order.createdAt);
      if (
        orderDate.getFullYear() === year &&
        orderDate.getMonth() === month && // Month is 0-indexed
        order.status === "Completed" // Only count completed orders for revenue
      ) {
        return sum + (parseFloat(order.price?.replace("PKR ", "")) || 0);
      }
      return sum;
    }, 0);
  };

  // Fetches all orders from the backend
  const fetchOrders = async () => {
    console.log("Attempting to fetch orders...");
    setLoadingOrders(true);
    setErrorOrders(null);
    try {
      const res = await axios.get(
        "https://follower-cart-backend02.onrender.com/followerApi/allOrders"
      );
      console.log("Raw orders response:", res.data);

      const fetchedOrders = res.data.orders || [];
      console.log("Fetched orders (after .orders access):", fetchedOrders);

      const formatted = fetchedOrders.map((order) => {
        return {
          id: order.id,
          orderId: order.id,
          name: order.name || "N/A",
          email: order.email || "N/A",
          service: order.service || "N/A",
          requiredFollowers: order.amount || "N/A",
          // Use formatDate helper for display date
          date: formatDate(order.createdAt),
          createdAt: order.createdAt, // Store original ISO string for calculations
          status: order.status || "Pending",
          platform: order.platform || "N/A",
          postLink: order.postLink || "N/A",
          price: order.price || "PKR 0",
        };
      });
      console.log("Formatted orders:", formatted);
      setOrders(formatted);
      setActionMessage(null); // Clear any previous action messages on successful fetch

      // --- Calculate stats based on fetched orders ---
      setTotalOrders(formatted.length);

      const currentMonthRevenueTotal = formatted.reduce(
        (sum, order) =>
          sum + (parseFloat(order.price?.replace("PKR ", "")) || 0),
        0
      );
      setTotalRevenuePKR(currentMonthRevenueTotal.toFixed(2));

      // Calculate Revenue Growth
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth(); // 0-indexed

      // Get previous month and year
      let prevMonth = currentMonth - 1;
      let prevYear = currentYear;
      if (prevMonth < 0) {
        prevMonth = 11; // December
        prevYear -= 1; // Previous year
      }

      const revenueCurrentMonth = getMonthlyRevenue(
        formatted,
        currentYear,
        currentMonth
      );
      const revenuePreviousMonth = getMonthlyRevenue(
        formatted,
        prevYear,
        prevMonth
      );

      // --- Debugging Logs for Growth Calculation ---
      console.log(
        `Growth Debug: Current Year: ${currentYear}, Current Month: ${currentMonth}`
      );
      console.log(
        `Growth Debug: Previous Year: ${prevYear}, Previous Month: ${prevMonth}`
      );
      console.log(
        `Growth Debug: Revenue Current Month: ${revenueCurrentMonth}`
      );
      console.log(
        `Growth Debug: Revenue Previous Month: ${revenuePreviousMonth}`
      );
      // --- End Debugging Logs ---

      let growth = 0;
      if (revenuePreviousMonth > 0) {
        growth =
          ((revenueCurrentMonth - revenuePreviousMonth) /
            revenuePreviousMonth) *
          100;
      } else if (revenueCurrentMonth > 0) {
        // If previous month revenue was 0 and current month revenue is > 0, it's 100% growth (or infinite, but 100% is more practical for display)
        growth = 100;
      }
      // If both current and previous month revenues are 0, growth remains 0.
      setRevenueGrowth(growth.toFixed(2));
      console.log(`Growth Debug: Calculated Growth: ${growth.toFixed(2)}%`); // Log final calculated growth

      const completed = formatted.filter(
        (o) => o.status === "Completed"
      ).length;
      const inProgress = formatted.filter(
        (o) => o.status === "In Progress"
      ).length;
      const pending = formatted.filter((o) => o.status === "Pending").length;
      const paymentPending = formatted.filter(
        // New: Count Payment Pending orders
        (o) => o.status === "Payment Pending"
      ).length;
      const cancelled = formatted.filter(
        (o) => o.status === "Cancelled"
      ).length;
      const refunded = formatted.filter((o) => o.status === "Refunded").length;
      const failed = formatted.filter((o) => o.status === "Failed").length;

      setCompletedOrdersCount(completed);
      setInProgressOrdersCount(inProgress);
      setPendingOrdersCount(pending + paymentPending); // Combine for overview
      setCancelledOrdersCount(cancelled);
      setRefundedOrdersCount(refunded);
      setFailedOrdersCount(failed);

      const serviceDist = formatted.reduce((acc, order) => {
        const serviceName = order.service || "Unknown Service";
        acc[serviceName] = (acc[serviceName] || 0) + 1;
        return acc;
      }, {});
      setServiceDistribution(serviceDist);

      const revenueByServ = formatted.reduce((acc, order) => {
        const serviceName = order.service || "Unknown Service";
        const price = parseFloat(order.price?.replace("PKR ", "")) || 0;
        acc[serviceName] = (acc[serviceName] || 0) + price;
        return acc;
      }, {});
      // Format revenue to 2 decimal places for display
      const formattedRevenueByServ = Object.fromEntries(
        Object.entries(revenueByServ).map(([key, value]) => [
          key,
          value.toFixed(2),
        ])
      );
      setRevenueByService(formattedRevenueByServ);

      // Prepare data for Recharts
      setOrderStatusChartData([
        { name: "Completed", count: completed, fill: "#10B981" }, // green-500
        { name: "In Progress", count: inProgress, fill: "#3B82F6" }, // blue-500
        { name: "Pending", count: pending + paymentPending, fill: "#F59E0B" }, // yellow-500 (combined)
        { name: "Cancelled", count: cancelled, fill: "#EF4444" }, // red-500
        { name: "Refunded", count: refunded, fill: "#6B7280" }, // gray-500
        { name: "Failed", count: failed, fill: "#DC2626" }, // red-700
      ]);

      setRevenueByServiceChartData(
        Object.entries(revenueByServ).map(([serviceName, revenue]) => ({
          name: serviceName,
          revenue: parseFloat(revenue.toFixed(2)), // Ensure it's a number for chart
        }))
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
      setErrorOrders("Failed to fetch orders. Please check server connection.");
      setOrders([]); // Clear orders on error
      // Reset all order-related stats on error
      setTotalOrders(0);
      setTotalRevenuePKR("0.00");
      setRevenueGrowth("0.00"); // Reset growth on error
      setCompletedOrdersCount(0);
      setInProgressOrdersCount(0);
      setPendingOrdersCount(0);
      setCancelledOrdersCount(0);
      setRefundedOrdersCount(0);
      setFailedOrdersCount(0);
      setServiceDistribution({});
      setRevenueByService({});
      setOrderStatusChartData([]);
      setRevenueByServiceChartData([]);
    } finally {
      setLoadingOrders(false);
      console.log("Finished fetching orders.");
    }
  };

  // Fetches all users from the backend
  const fetchUsers = async () => {
    console.log("Attempting to fetch users...");
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const res = await axios.get(
        "https://follower-cart-backend02.onrender.com/followerApi/alluser"
      ); // Ensure this endpoint is correct
      console.log("Raw users response:", res.data);
      setUsersData(res.data);
      setTotalUsers(res.data.length); // Update total users stat
      setActionMessage(null); // Clear any previous action messages on successful fetch
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorUsers("Failed to fetch users. Please check server connection.");
      setUsersData([]); // Clear users on error
      setTotalUsers(0); // Reset total users stat on error
    } finally {
      setLoadingUsers(false);
      console.log("Finished fetching users.");
    }
  };

  // NEW: Fetches all payment details from the backend
  const fetchPayments = async () => {
    console.log("Attempting to fetch payments...");
    setLoadingPayments(true);
    setErrorPayments(null);
    try {
      const res = await axios.get(
        "https://follower-cart-backend02.onrender.com/followerApi/allPayments"
      );
      console.log("Raw payments response:", res.data);
      // Ensure paymentDate is used for display
      const formattedPayments = (res.data.payments || []).map((payment) => ({
        ...payment,
        // Use the formatDate helper for paymentDate
        paymentDate: formatDate(payment.paymentDate),
        // If orderId is populated, it will be an object. Access its _id if needed.
        orderId: payment.orderId ? payment.orderId._id : null,
        orderPrice: payment.orderId ? payment.orderId.price : null,
      }));
      setPaymentsData(formattedPayments);
      setActionMessage(null); // Clear any previous action messages on successful fetch
    } catch (error) {
      console.error("Error fetching payments:", error);
      setErrorPayments(
        "Failed to fetch payment details. Please check server connection."
      );
      setPaymentsData([]); // Clear payments on error
    } finally {
      setLoadingPayments(false);
      console.log("Finished fetching payments.");
    }
  };

  // NEW: Fetches all refund requests from the backend
  const fetchRefundRequests = async () => {
    console.log("Attempting to fetch refund requests...");
    setLoadingRefunds(true);
    setErrorRefunds(null);
    try {
      const res = await axios.get(
        "https://follower-cart-backend02.onrender.com/followerApi/RefundRequests"
      );
      console.log("Raw refund requests response:", res.data);
      const formattedRequests = (res.data.requests || []).map((request) => ({
        ...request,
        // Ensure order details are accessible if populated
        orderId: request.order ? request.order._id : null,
        orderPrice: request.order ? request.order.price : null,
        orderService: request.order ? request.order.service : null,
        // Format date for display
        createdAt: formatDate(request.createdAt),
      }));
      setRefundRequests(formattedRequests);
    } catch (error) {
      console.error("Error fetching refund requests:", error);
      setErrorRefunds(
        "Failed to fetch refund requests. Please check server connection."
      );
      setRefundRequests([]);
    } finally {
      setLoadingRefunds(false);
      console.log("Finished fetching refund requests.");
    }
  };

  // Fetch data when the component mounts (initial load)
  useEffect(() => {
    fetchOrders();
    fetchUsers();
    fetchPayments();
    fetchRefundRequests(); // NEW: Call on component mount
  }, []); // Empty dependency array means it runs once on mount

  // Handles marking an order as "Completed"
  const handleCompleteOrder = async (orderId) => {
    setActionMessage(null); // Clear previous messages

    try {
      // Optimistically update the UI first for a snappier feel
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Completed" } : order
        )
      );

      // Make the API call to update the order status on the backend
      const res = await axios.patch(
        `https://follower-cart-backend02.onrender.com/followerApi/updateOrder/${orderId}`,
        { status: "Completed" }
      );
      console.log(`Order ${orderId} updated to Completed:`, res.data);

      setActionMessage({
        type: "success",
        text: `Order ${orderId.substring(
          0,
          8
        )}... successfully marked as "Completed".`,
      });

      // Re-fetch all orders to ensure UI is consistent with backend data
      fetchOrders(); // Re-fetch to update all stats and lists
    } catch (error) {
      console.error(`Error completing order ${orderId}:`, error);
      setActionMessage({
        type: "error",
        text: `Failed to complete order ${orderId.substring(
          0,
          8
        )}.... Please try again.`,
      });
      // If there's an error, re-fetch to revert the optimistic update
      fetchOrders();
    }
  };

  // Handles marking an order as "In Progress"
  const handleInProgressOrder = async (orderId) => {
    setActionMessage(null); // Clear previous messages

    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "In Progress" } : order
        )
      );

      const res = await axios.patch(
        `https://follower-cart-backend02.onrender.com/followerApi/updateOrder/${orderId}`,
        { status: "In Progress" }
      );
      console.log(`Order ${orderId} updated to In Progress:`, res.data);

      setActionMessage({
        type: "info", // Use 'info' for in-progress message
        text: `Order ${orderId.substring(
          0,
          8
        )}... successfully marked as "In Progress".`,
      });

      fetchOrders();
    } catch (error) {
      console.error(`Error marking order ${orderId} as In Progress:`, error);
      setActionMessage({
        type: "error",
        text: `Failed to mark order ${orderId.substring(
          0,
          8
        )}... as "In Progress". Please try again.`,
      });
      fetchOrders();
    }
  };

  // Function to open the cancel confirmation modal
  const confirmCancelOrder = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  // Function to handle order cancellation API call
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
      fetchOrders(); // Re-fetch orders to update the list and stats
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

  // --- Payment Management Functions ---

  // Function to open the payment action modal (Approve/Reject)
  const confirmPaymentAction = (payment, action) => {
    setPaymentToUpdate(payment);
    setPaymentActionType(action); // 'approve' or 'reject'
    setShowPaymentActionModal(true);
  };

  // Function to handle payment approval/rejection API call
  const handlePaymentAction = async () => {
    if (!paymentToUpdate || !paymentActionType) return;

    setShowPaymentActionModal(false); // Close modal immediately
    setActionMessage(null); // Clear previous action messages

    const newStatus = paymentActionType === "approve" ? "Approved" : "Rejected";

    try {
      // 1. Update payment status in the database
      const paymentResponse = await axios.patch(
        `https://follower-cart-backend02.onrender.com/followerApi/updatePayment/${paymentToUpdate._id}`,
        { status: newStatus }
      );
      console.log(
        `Payment ${paymentToUpdate._id} updated to ${newStatus}:`,
        paymentResponse.data
      );

      // 2. If payment is approved, also update the associated order's status to "In Progress"
      if (newStatus === "Approved" && paymentToUpdate.orderId) {
        const orderResponse = await axios.patch(
          `https://follower-cart-backend02.onrender.com/followerApi/updateOrder/${paymentToUpdate.orderId}`,
          { status: "In Progress" }
        );
        console.log(
          `Order ${paymentToUpdate.orderId} status updated to In Progress:`,
          orderResponse.data
        );
      }

      setActionMessage({
        type: "success",
        text: `Payment ${paymentToUpdate._id.substring(
          0,
          8
        )}... successfully marked as "${newStatus}".`,
      });

      // Re-fetch both payments and orders to ensure UI consistency and updated stats
      fetchPayments();
      fetchOrders();
    } catch (error) {
      console.error(`Error ${paymentActionType} payment:`, error);
      setActionMessage({
        type: "error",
        text: `Failed to ${paymentActionType} payment ${paymentToUpdate._id.substring(
          0,
          8
        )}.... Please try again.`,
      });
      // Re-fetch on error to revert optimistic updates if any
      fetchPayments();
      fetchOrders();
    } finally {
      setPaymentToUpdate(null);
      setPaymentActionType("");
    }
  };

  // --- User Management Functions ---

  // Opens the edit user modal and populates form data
  const openEditUserModal = (userItem) => {
    setUserToEdit(userItem);
    setEditFormData({
      name: userItem.name,
      email: userItem.email,
      role: userItem.role,
      isBanned: userItem.isBanned,
      phoneNumber: userItem.phoneNumber || "", // Ensure phoneNumber is not null/undefined
    });
    setShowEditUserModal(true);
  };

  // Handles changes in the edit user form
  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submits the edited user data
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!userToEdit) return;

    setLoadingUsers(true); // Indicate loading for user operations
    try {
      // Only send fields that are editable by admin, and exclude sensitive ones like password
      const updates = {
        name: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
        isBanned: editFormData.isBanned,
        phoneNumber: editFormData.phoneNumber,
      };

      const res = await axios.patch(
        `https://follower-cart-backend02.onrender.com/followerApi/update/${userToEdit._id}`,
        updates
      );
      console.log("User updated:", res.data);
      toast.success(`User ${editFormData.name} updated successfully!`);
      setShowEditUserModal(false); // Close modal
      fetchUsers(); // Re-fetch users to update the table
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.msg || "Failed to update user.");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Opens the delete user confirmation modal
  const confirmDeleteUser = (userItem) => {
    setUserToDelete(userItem);
    setShowDeleteUserModal(true);
  };

  // Handles deleting a user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setShowDeleteUserModal(false); // Close modal immediately
    setLoadingUsers(true); // Indicate loading for user operations
    try {
      const res = await axios.delete(
        `https://follower-cart-backend02.onrender.com/followerApi/delete/${userToDelete._id}`
      );
      console.log("User deleted:", res.data);
      toast.success(`User ${userToDelete.name} deleted successfully!`);
      fetchUsers(); // Re-fetch users to update the table
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.msg || "Failed to delete user.");
    } finally {
      setLoadingUsers(false);
      setUserToDelete(null); // Clear user to delete
    }
  };

  // --- Refund Management Functions ---

  // Opens the refund action modal
  const confirmRefundAction = (request, action) => {
    setRefundToUpdate(request);
    setRefundActionType(action); // 'approve' or 'reject'
    setRefundAdminRemarks(request.adminRemarks || ""); // Pre-fill remarks if any
    setShowRefundActionModal(true);
  };

  // Handles refund approval/rejection API call
  const handleRefundAction = async () => {
    if (!refundToUpdate || !refundActionType) return;

    setShowRefundActionModal(false); // Close modal immediately
    toast.dismiss(); // Dismiss any existing toasts
    setLoadingRefunds(true); // Indicate loading

    const newStatus = refundActionType === "approve" ? "Approved" : "Rejected";

    try {
      const res = await axios.patch(
        `https://follower-cart-backend02.onrender.com/followerApi/updateRefundRequest/${refundToUpdate._id}`,
        { status: newStatus, adminRemarks: refundAdminRemarks }
      );
      console.log(
        `Refund request ${refundToUpdate._id} updated to ${newStatus}:`,
        res.data
      );
      toast.success(
        `Refund request ${refundToUpdate._id.substring(
          0,
          8
        )}... ${newStatus.toLowerCase()} successfully!`
      );

      // Re-fetch refund requests to update the list
      fetchRefundRequests();
      fetchOrders(); // Also re-fetch orders if you update order status to "Refunded" on approval
    } catch (error) {
      console.error(`Error ${refundActionType} refund request:`, error);
      toast.error(
        error.response?.data?.msg ||
          `Failed to ${refundActionType} refund request.`
      );
    } finally {
      setLoadingRefunds(false);
      setRefundToUpdate(null);
      setRefundActionType("");
      setRefundAdminRemarks("");
    }
  };

  // Returns Tailwind CSS classes for status badges based on status string
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
      case "Approved": // For payments
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
      case "Payment Pending": // For orders
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
      case "Failed":
      case "Rejected": // For payments AND Refunds
      case "Refunded": // For orders AND Refunds
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800"; // Fallback for unknown statuses
    }
  };

  // Returns an appropriate icon color based on the badge background color
  const getIconColorForBadge = (statusClass) => {
    if (statusClass.includes("green")) return "#10B981"; // Tailwind green-500
    if (statusClass.includes("blue")) return "#3B82F6"; // Tailwind blue-500
    if (statusClass.includes("yellow")) return "#F59E0B"; // Tailwind yellow-500
    if (statusClass.includes("red")) return "#EF4444"; // Tailwind red-500
    return "#6B7280"; // Default gray for unknown/default
  };

  // Dashboard statistics cards data
  const stats = [
    {
      label: "Total Users",
      value: totalUsers.toString(),
      icon: <Users className="h-6 w-6" />,
      color: "text-blue-600",
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: <ShoppingBag className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      label: "Revenue (PKR)",
      value: `PKR ${totalRevenuePKR}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: "text-purple-600",
    },
    {
      label: "Growth (MoM)", // Changed label to reflect MoM
      value: `${revenueGrowth}%`, // Display calculated growth
      icon: <TrendingUp className="h-6 w-6" />,
      color: parseFloat(revenueGrowth) >= 0 ? "text-green-600" : "text-red-600", // Dynamic color based on growth
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Followers Cart Dashboard
              </h1>
              <p className="text-gray-600">
                Manage users, orders, and system analytics
              </p>
            </div>
          </div>
        </div>

        {/* Tabs for Navigation */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex overflow-x-auto">
              {[
                {
                  id: "overview",
                  name: "Overview",
                  icon: <BarChart3 className="h-5 w-5" />,
                },
                {
                  id: "users",
                  name: "Manage Users",
                  icon: <Users className="h-5 w-5" />,
                },
                {
                  id: "orders",
                  name: "Manage Orders",
                  icon: <Package className="h-5 w-5" />,
                },
                {
                  id: "payments", // New tab ID
                  name: "Payment Details", // New tab name
                  icon: <CreditCard className="h-5 w-5" />, // New icon
                },
                {
                  id: "refunds",
                  name: "Refund Requests",
                  icon: <AlertCircle className="h-5 w-5" />,
                },
                {
                  id: "analytics",
                  name: "Analytics",
                  icon: <TrendingUp className="h-5 w-5" />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600" // Active tab styling
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" // Inactive tab styling
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content Area */}
          <div className="p-8">
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
                {actionMessage.type === "success" ||
                actionMessage.type === "info" ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 mr-2" />
                )}
                {actionMessage.text}
              </div>
            )}

            {/* Overview Tab Content */}
            {activeTab === "overview" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Dashboard Overview
                </h2>
                {/* Re-using the stats cards here */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                    >
                      <div className="flex items-center">
                        <div className={`${stat.color} mr-4`}>{stat.icon}</div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {stat.value}
                          </div>
                          <div className="text-gray-600 text-sm">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Recent Orders
                </h3>
                {loadingOrders ? (
                  <div className="flex justify-center items-center h-24">
                    <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                    <span className="ml-2 text-gray-600">
                      Loading recent orders...
                    </span>
                  </div>
                ) : errorOrders ? (
                  <div className="text-center text-red-600 py-8 flex flex-col items-center">
                    <Info className="h-10 w-10 mb-2" />
                    <p>{errorOrders}</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center text-gray-500 py-8 flex flex-col items-center">
                    <Info className="h-10 w-10 mb-2" />
                    <p>No recent orders found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                    <table className="min-w-full text-sm text-left divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Client Email</th>
                          <th className="py-3 px-4">Service</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.slice(0, 5).map(
                          (
                            order // Show top 5 recent orders
                          ) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="py-3 px-4">
                                #{order.orderId.substring(0, 8)}...
                              </td>
                              <td className="py-3 px-4">{order.email}</td>
                              <td className="py-3 px-4">{order.service}</td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                    order.status
                                  )}`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">{order.date}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab Content */}
            {activeTab === "users" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  User Management
                </h2>
                {loadingUsers ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                    <span className="ml-4 text-lg text-gray-600">
                      Loading users...
                    </span>
                  </div>
                ) : errorUsers ? (
                  <div className="text-center text-red-600 py-16 flex flex-col items-center">
                    <Info className="h-12 w-12 mb-4" />
                    <p className="text-lg">{errorUsers}</p>
                    <p className="text-md text-gray-500 mt-2">
                      Please ensure your backend server is running and
                      accessible.
                    </p>
                  </div>
                ) : usersData.length === 0 ? (
                  <div className="text-center text-gray-500 py-16 flex flex-col items-center">
                    <Info className="h-12 w-12 mb-4" />
                    <p className="text-lg">No users found.</p>
                    <p className="text-md mt-2">
                      There are no registered users yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full text-sm text-left divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4">User ID</th>
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Role</th>
                          <th className="py-3 px-4">Registered On</th>
                          <th className="py-3 px-4 text-center">
                            Actions
                          </th>{" "}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {usersData.map((userItem) => (
                          <tr
                            key={userItem._id}
                            className="border-t hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">
                              #{userItem._id.substring(0, 8)}...
                            </td>
                            <td className="py-3 px-4">{userItem.name}</td>
                            <td className="py-3 px-4">{userItem.email}</td>
                            <td className="py-3 px-4">
                              {userItem.role === "admin" ? "Admin" : "User"}
                            </td>
                            <td className="py-3 px-4">
                              {formatDate(userItem.createdAt)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {" "}
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={() => openEditUserModal(userItem)}
                                  className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                                  title="Edit User"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                {/* Prevent deleting the currently logged-in admin user */}
                                {user && user._id !== userItem._id && (
                                  <button
                                    onClick={() => confirmDeleteUser(userItem)}
                                    className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                                    title="Delete User"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab Content */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Management
                </h2>
                {loadingOrders ? (
                  // Loading state for orders
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-10 w-10 animate-spin text-red-500" />
                    <span className="ml-4 text-lg text-gray-600">
                      Loading orders...
                    </span>
                  </div>
                ) : errorOrders ? (
                  // Error state for orders
                  <div className="text-center text-red-600 py-16 flex flex-col items-center">
                    <Info className="h-12 w-12 mb-4" />
                    <p className="text-lg">{errorOrders}</p>
                    <p className="text-md text-gray-500 mt-2">
                      Please ensure your backend server is running and
                      accessible.
                    </p>
                  </div>
                ) : orders.length === 0 ? (
                  // Empty state for orders
                  <div className="text-center text-gray-500 py-16 flex flex-col items-center">
                    <Info className="h-12 w-12 mb-4" />
                    <p className="text-lg">No orders found.</p>
                    <p className="text-md mt-2">
                      Looks like there are no orders to manage yet.
                    </p>
                  </div>
                ) : (
                  // Orders Table
                  <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full text-sm text-left divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Client Name</th>
                          <th className="py-3 px-4">Client Email</th>
                          <th className="py-3 px-4">Platform</th>
                          <th className="py-3 px-4">Service</th>
                          <th className="py-3 px-4">Quantity</th>
                          <th className="py-3 px-4">Price (PKR)</th>
                          <th className="py-3 px-4 text-center">
                            Status & Actions
                          </th>{" "}
                          {/* Merged column header */}
                          <th className="py-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => {
                          const badgeClass = getStatusBadgeClass(order.status);
                          const iconColor = getIconColorForBadge(badgeClass);

                          // Determine which icon to show next to the status
                          let statusIcon;
                          switch (order.status) {
                            case "Completed":
                              statusIcon = (
                                <CheckCircle
                                  className="h-4 w-4"
                                  style={{ color: iconColor }}
                                />
                              );
                              break;
                            case "In Progress":
                              statusIcon = (
                                <Loader2
                                  className="h-4 w-4 animate-spin"
                                  style={{ color: iconColor }}
                                />
                              );
                              break;
                            case "Payment Pending": // New status for orders
                            case "Pending":
                              statusIcon = (
                                <Clock
                                  className="h-4 w-4"
                                  style={{ color: iconColor }}
                                />
                              );
                              break;
                            case "Cancelled":
                            case "Failed":
                            case "Refunded":
                              statusIcon = (
                                <Ban
                                  className="h-4 w-4"
                                  style={{ color: iconColor }}
                                />
                              );
                              break;
                            default:
                              statusIcon = (
                                <Info
                                  className="h-4 w-4"
                                  style={{ color: iconColor }}
                                />
                              );
                          }

                          return (
                            <tr
                              key={order.id}
                              className="border-t hover:bg-gray-50"
                            >
                              <td className="py-3 px-4 font-medium text-gray-900">
                                #{order.orderId}
                              </td>
                              <td className="py-3 px-4">{order.name}</td>
                              <td className="py-3 px-4">{order.email}</td>
                              <td className="py-3 px-4">{order.platform}</td>
                              <td className="py-3 px-4">{order.service}</td>
                              <td className="py-3 px-4">
                                {order.requiredFollowers.toLocaleString()}
                              </td>
                              <td className="py-3 px-4">{order.price}</td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center space-x-2">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${badgeClass}`}
                                  >
                                    {statusIcon}
                                    <span className="ml-1">{order.status}</span>
                                  </span>
                                  {/* Action buttons */}
                                  {(order.status === "Pending" ||
                                    order.status === "Payment Pending") && (
                                    <button
                                      onClick={() =>
                                        handleInProgressOrder(order.id)
                                      }
                                      className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                                      title="Mark In Progress"
                                    >
                                      <Loader2 className="h-4 w-4" />
                                    </button>
                                  )}
                                  {order.status === "In Progress" && (
                                    <button
                                      onClick={() =>
                                        handleCompleteOrder(order.id)
                                      }
                                      className="p-1.5 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                                      title="Mark Complete"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </button>
                                  )}
                                  {order.status !== "Completed" &&
                                    order.status !== "Cancelled" &&
                                    order.status !== "Refunded" &&
                                    order.status !== "Failed" && (
                                      <button
                                        onClick={() =>
                                          confirmCancelOrder(order)
                                        }
                                        className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                                        title="Cancel Order"
                                      >
                                        <Ban className="h-4 w-4" />
                                      </button>
                                    )}
                                </div>
                              </td>
                              <td className="py-3 px-4">{order.date}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Payment Details Tab Content */}
            {activeTab === "payments" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Payment Details
                </h2>
                {loadingPayments ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                    <span className="ml-4 text-lg text-gray-600">
                      Loading payment details...
                    </span>
                  </div>
                ) : errorPayments ? (
                  <div className="text-center text-red-600 py-16 flex flex-col items-center">
                    <Info className="h-12 w-12 mb-4" />
                    <p className="text-lg">{errorPayments}</p>
                    <p className="text-md text-gray-500 mt-2">
                      Please ensure your backend server is running and
                      accessible.
                    </p>
                  </div>
                ) : paymentsData.length === 0 ? (
                  <div className="text-center text-gray-500 py-16 flex flex-col items-center">
                    <Info className="h-12 w-12 mb-4" />
                    <p className="text-lg">No payment records found.</p>
                    <p className="text-md mt-2">
                      Payments will appear here once submitted by clients.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full text-sm text-left divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4">Payment ID</th>
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Client Email</th>
                          <th className="py-3 px-4">Amount (PKR)</th>
                          <th className="py-3 px-4">Method</th>
                          <th className="py-3 px-4">Transaction ID</th>
                          <th className="py-3 px-4">Screenshot</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Payment Date</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paymentsData.map((payment) => {
                          const badgeClass = getStatusBadgeClass(
                            payment.status
                          );
                          return (
                            <tr key={payment._id} className="hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium text-gray-900">
                                #{payment._id.substring(0, 8)}...
                              </td>
                              <td className="py-3 px-4">
                                {payment.orderId ? (
                                  <a
                                    href={`/order/${payment.orderId}`} // Link to order detail page if exists
                                    className="text-blue-600 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    #{payment.orderId.substring(0, 8)}...
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td className="py-3 px-4">
                                {payment.clientEmail}
                              </td>
                              <td className="py-3 px-4">
                                PKR {payment.amount?.toFixed(0) || "0"}
                              </td>
                              <td className="py-3 px-4">
                                {payment.paymentMethod}
                              </td>
                              <td className="py-3 px-4 break-all">
                                {payment.transactionId || "N/A"}
                              </td>
                              <td className="py-3 px-4">
                                {payment.screenshotUrl ? (
                                  <a
                                    href={payment.screenshotUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center justify-center"
                                  >
                                    <Eye className="h-4 w-4 mr-1" /> View
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}
                                >
                                  {payment.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {payment.paymentDate}
                              </td>{" "}
                              {/* Display formatted payment date */}
                              <td className="py-3 px-4 text-center">
                                {payment.status === "Pending" && (
                                  <div className="flex justify-center space-x-2">
                                    <button
                                      onClick={() =>
                                        confirmPaymentAction(payment, "approve")
                                      }
                                      className="p-1.5 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                                      title="Approve Payment"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        confirmPaymentAction(payment, "reject")
                                      }
                                      className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                                      title="Reject Payment"
                                    >
                                      <Ban className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                                {(payment.status === "Approved" ||
                                  payment.status === "Rejected") && (
                                  <span className="text-gray-500 text-xs">
                                    (No actions)
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Refund Requests Tab Content */}
            {activeTab === "refunds" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Refund Requests
                </h2>
                {loadingRefunds ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
                    <span className="ml-4 text-lg text-gray-600">
                      Loading refund requests...
                    </span>
                  </div>
                ) : errorRefunds ? (
                  <div className="text-center text-red-600 py-16 flex flex-col items-center">
                    <Info className="h-12 w-12 mb-4" />
                    <p className="text-lg">{errorRefunds}</p>
                    <p className="text-md text-gray-500 mt-2">
                      Please ensure your backend server is running and
                      accessible.
                    </p>
                  </div>
                ) : refundRequests.length === 0 ? (
                  <div className="text-center text-gray-500 py-16 flex flex-col items-center">
                    <Info className="h-12 w-12 mb-4" />
                    <p className="text-lg">No refund requests at this time.</p>
                    <p className="text-md mt-2">
                      This section will display pending refund requests.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full text-sm text-left divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4">Request ID</th>
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Client Email</th>
                          <th className="py-3 px-4">Amount (PKR)</th>
                          <th className="py-3 px-4">Reason</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Requested On</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {refundRequests.map((request) => {
                          const badgeClass = getStatusBadgeClass(
                            request.status
                          );
                          return (
                            <tr key={request._id} className="hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium text-gray-900">
                                #{request._id.substring(0, 8)}...
                              </td>
                              <td className="py-3 px-4">
                                {request.orderId ? (
                                  <a
                                    href={`/order/${request.orderId}`} // Link to order detail page if exists
                                    className="text-blue-600 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    #{request.orderId.substring(0, 8)}...
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td className="py-3 px-4">
                                {request.clientEmail}
                              </td>
                              <td className="py-3 px-4">
                                PKR {request.amount?.toFixed(0) || "0"}
                              </td>
                              <td className="py-3 px-4">{request.reason}</td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}
                                >
                                  {request.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">{request.createdAt}</td>
                              <td className="py-3 px-4 text-center">
                                {request.status === "Pending" && (
                                  <div className="flex justify-center space-x-2">
                                    <button
                                      onClick={() =>
                                        confirmRefundAction(request, "approve")
                                      }
                                      className="p-1.5 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                                      title="Approve Refund"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        confirmRefundAction(request, "reject")
                                      }
                                      className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                                      title="Reject Refund"
                                    >
                                      <Ban className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                                {(request.status === "Approved" ||
                                  request.status === "Rejected") && (
                                  <span className="text-gray-500 text-xs">
                                    (No actions)
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab Content */}
            {activeTab === "analytics" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  System Analytics
                </h2>

                {loadingOrders ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-10 w-10 animate-spin text-red-500" />
                    <span className="ml-4 text-lg text-gray-600">
                      Loading analytics data...
                    </span>
                  </div>
                ) : errorOrders ? (
                  <div className="text-center text-red-600 py-16 flex flex-col items-center">
                    <Info className="h-12 w-12 mb-4" />
                    <p className="text-lg">{errorOrders}</p>
                    <p className="text-md text-gray-500 mt-2">
                      Cannot display analytics without order data.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* Order Status Distribution Chart */}
                      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Order Status Distribution
                        </h3>
                        {orderStatusChartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={orderStatusChartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="count" />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            No order status data to display.
                          </div>
                        )}
                      </div>

                      {/* Revenue by Service Chart */}
                      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Revenue by Service (PKR)
                        </h3>
                        {revenueByServiceChartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={revenueByServiceChartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis
                                tickFormatter={(value) => `PKR ${value}`}
                              />
                              <Tooltip
                                formatter={(value) => [
                                  `PKR ${value}`,
                                  "Revenue",
                                ]}
                              />
                              <Legend />
                              <Bar dataKey="revenue" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            No revenue by service data to display.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Detailed Order Status Counts
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-700">
                            {completedOrdersCount}
                          </p>
                          <p className="text-sm text-gray-600">Completed</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-700">
                            {inProgressOrdersCount}
                          </p>
                          <p className="text-sm text-gray-600">In Progress</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-700">
                            {pendingOrdersCount}
                          </p>
                          <p className="text-sm text-gray-600">Pending</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                          <p className="text-2xl font-bold text-red-700">
                            {cancelledOrdersCount}
                          </p>
                          <p className="text-sm text-gray-600">Cancelled</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-gray-700">
                            {refundedOrdersCount}
                          </p>
                          <p className="text-sm text-gray-600">Refunded</p>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg">
                          <p className="text-2xl font-bold text-red-800">
                            {failedOrdersCount}
                          </p>
                          <p className="text-sm text-gray-600">Failed</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Service Distribution
                      </h3>
                      {Object.keys(serviceDistribution).length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700">
                          {Object.entries(serviceDistribution).map(
                            ([service, count]) => (
                              <li key={service}>
                                <strong>{service}:</strong> {count} orders
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          No service distribution data.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Cancellation
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel order{" "}
              <strong>#{orderToCancel?.id.substring(0, 8)}...</strong>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                No, Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Action Confirmation Modal */}
      {showPaymentActionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Payment{" "}
              {paymentActionType === "approve" ? "Approval" : "Rejection"}
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to <strong>{paymentActionType}</strong>{" "}
              payment{" "}
              <strong>#{paymentToUpdate?._id.substring(0, 8)}...</strong>? This
              action will update the payment status and, if approved, the
              associated order status to "In Progress".
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentActionModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                No, Go Back
              </button>
              <button
                onClick={handlePaymentAction}
                className={`px-4 py-2 rounded-md transition-colors ${
                  paymentActionType === "approve"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                Yes, {paymentActionType === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Edit User Modal */}
      {showEditUserModal && userToEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Edit User: {userToEdit.name}
            </h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label
                  htmlFor="editName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="editName"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="editEmail"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editPhoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="editPhoneNumber"
                  name="phoneNumber"
                  value={editFormData.phoneNumber}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="editRole"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="editRole"
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsBanned"
                  name="isBanned"
                  checked={editFormData.isBanned}
                  onChange={handleEditFormChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="editIsBanned"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Is Banned
                </label>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingUsers}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  {loadingUsers ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW: Delete User Confirmation Modal */}
      {showDeleteUserModal && userToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm User Deletion
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete user{" "}
              <strong>{userToDelete.name}</strong> (
              <strong>{userToDelete.email}</strong>)? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteUserModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                No, Keep User
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={loadingUsers}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                {loadingUsers ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Yes, Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Refund Action Confirmation Modal */}
      {showRefundActionModal && refundToUpdate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Refund{" "}
              {refundActionType === "approve" ? "Approval" : "Rejection"}
            </h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to <strong>{refundActionType}</strong> this
              refund request for order{" "}
              <strong>#{refundToUpdate.orderId?.substring(0, 8)}...</strong>{" "}
              (PKR {refundToUpdate.amount?.toFixed(0)})?
            </p>
            <p className="text-gray-700 mb-6">
              Reason: <em>"{refundToUpdate.reason}"</em>
            </p>
            <div className="mb-4">
              <label
                htmlFor="adminRemarks"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin Remarks (Optional)
              </label>
              <textarea
                id="adminRemarks"
                name="adminRemarks"
                rows="3"
                value={refundAdminRemarks}
                onChange={(e) => setRefundAdminRemarks(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any notes for the client or record..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRefundActionModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                No, Go Back
              </button>
              <button
                onClick={handleRefundAction}
                disabled={loadingRefunds}
                className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                  refundActionType === "approve"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {loadingRefunds ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : refundActionType === "approve" ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <Ban className="h-4 w-4 mr-2" />
                )}
                Yes, {refundActionType === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
