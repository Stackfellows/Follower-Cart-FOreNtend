import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ClientDashboard from "./pages/ClientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Order from "./pages/Order"; // Assuming Order is in pages folder
import Blog from "./pages/BlogPost";
import TrackOrder from "./pages/TrackOrder";
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Import the new ScrollToTop component (if you had it, keep it)
// import ScrollToTop from "./components/ScrollToTop"; // Uncomment if you use ScrollToTop component

// Instagram Services
import InstagramFollowers from "./pages/services/instagram/InstagramFollowers";
import InstagramLikes from "./pages/services/instagram/InstagramLikes";
import InstagramViews from "./pages/services/instagram/InstagramViews";
import InstagramReelsViews from "./pages/services/instagram/InstagramReelsViews";
import InstagramStoryViews from "./pages/services/instagram/InstagramStoryViews";
import InstagramComments from "./pages/services/instagram/InstagramComments";

// YouTube Services
import YouTubeSubscribers from "./pages/services/youtube/YouTubeSubscribers";
import YouTubeViews from "./pages/services/youtube/YouTubeViews";
import YouTubeLikes from "./pages/services/youtube/YouTubeLikes";
import YouTubeShares from "./pages/services/youtube/YouTubeShares";
import YouTubeWatchTime from "./pages/services/youtube/YouTubeWatchTime";
import YouTubeLiveStream from "./pages/services/youtube/YouTubeLiveStream";

// Facebook Services
import FacebookFollowers from "./pages/services/facebook/FacebookFollowers";
import FacebookLikes from "./pages/services/facebook/FacebookLikes";
import FacebookFemaleFollowers from "./pages/services/facebook/FacebookFemaleFollowers";
import FacebookEnglishFollowers from "./pages/services/facebook/FacebookEnglishFollowers";
import FacebookPageLikes from "./pages/services/facebook/FacebookPageLikes";

// TikTok Services
import TikTokFollowers from "./pages/services/tiktok/TikTokFollowers";
import TikTokLikes from "./pages/services/tiktok/TikTokLikes";
import TikTokViews from "./pages/services/tiktok/TikTokViews";

// CORRECTED IMPORTS:
// Changed from "./pages/BuyNow" to "./components/BuyNow"
import BuyNow from "./components/BuyNow";
// This should import the actual BuyNow component from components folder
import PaymentMethodForm from "./pages/PaymentMethodForm"; // This should import the PaymentMethodForm component
import OrderDetails from "./pages/OrderDetails"; // Corrected: Ensure no extra dot in import path
import ResetPassword from "./pages/ResetPassword";
import BlogDetails from "./pages/BlogDetails";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("App.jsx: useEffect running (initial load/localStorage check)");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log("App.jsx: User loaded from localStorage:", parsedUser);
        if (!parsedUser.email) {
          console.warn(
            "App.jsx: User loaded from localStorage is missing email property."
          );
        }
      } catch (e) {
        console.error("App.jsx: Failed to parse user from localStorage:", e);
        localStorage.removeItem("user"); // Clear corrupted data
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log(
      "App.jsx: handleLogin called, User state updated to:",
      userData
    );
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    console.log("App.jsx: User logged out.");
  };

  // Add a useEffect to log user state changes for debugging
  useEffect(() => {
    console.log("App.jsx: User state changed to:", user);
  }, [user]); // This will run whenever the 'user' state changes

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Router>
      {/* <ScrollToTop /> Uncomment if you use ScrollToTop component */}
      <div className="min-h-screen bg-white">
        <Navbar user={user} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            {/* Route for placing new orders or reordering - Pass user prop */}
            <Route path="/buy" element={<BuyNow user={user} />} />
            {/* NEW ROUTE: For payment processing after order creation */}
            <Route path="/payment/:orderId" element={<PaymentMethodForm />} />
            {/* Route for Order Details - Pass user prop */}
            <Route
              path="/order-details/:orderId"
              element={<OrderDetails user={user} />}
            />
            {/* Protected Routes */}
            <Route
              path="/client-dashboard"
              element={
                user && user.role === "user" ? (
                  <ClientDashboard user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* Admin-specific route: Restricted to demo45@followerscarts.com */}
            <Route
              path="/admin-dashboard"
              element={
                user &&
                user.role === "admin" &&
                user.email === "demo45@followerscarts.com" ? (
                  <AdminDashboard user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* Order page - Pass user prop */}
            <Route path="/order" element={<Order user={user} />} />
            <Route path="/blog" element={<Blog user={user} />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />
            {/* Instagram Services - These will likely navigate to /buy with pre-selected service/platform */}
            <Route
              path="/instagram/followers"
              element={<InstagramFollowers user={user} />} // Pass user if needed
            />
            <Route
              path="/instagram/likes"
              element={<InstagramLikes user={user} />}
            />
            <Route
              path="/instagram/views"
              element={<InstagramViews user={user} />}
            />
            <Route
              path="/instagram/reels-views"
              element={<InstagramReelsViews user={user} />}
            />
            <Route
              path="/instagram/story-views"
              element={<InstagramStoryViews user={user} />}
            />
            <Route
              path="/instagram/comments"
              element={<InstagramComments user={user} />}
            />
            {/* YouTube Services */}
            <Route
              path="/youtube/subscribers"
              element={<YouTubeSubscribers user={user} />}
            />
            <Route
              path="/youtube/views"
              element={<YouTubeViews user={user} />}
            />
            <Route
              path="/youtube/likes"
              element={<YouTubeLikes user={user} />}
            />
            <Route
              path="/youtube/shares"
              element={<YouTubeShares user={user} />}
            />
            <Route
              path="/youtube/watch-time"
              element={<YouTubeWatchTime user={user} />}
            />
            <Route
              path="/youtube/live-stream"
              element={<YouTubeLiveStream user={user} />}
            />
            {/* Facebook Services */}
            <Route
              path="/facebook/followers"
              element={<FacebookFollowers user={user} />}
            />
            <Route
              path="/facebook/likes"
              element={<FacebookLikes user={user} />}
            />
            <Route
              path="/facebook/female-followers"
              element={<FacebookFemaleFollowers user={user} />}
            />
            <Route
              path="/facebook/english-followers"
              element={<FacebookEnglishFollowers user={user} />}
            />
            <Route
              path="/facebook/page-likes"
              element={<FacebookPageLikes user={user} />}
            />
            {/* TikTok Services */}
            <Route
              path="/tiktok/followers"
              element={<TikTokFollowers user={user} />}
            />
            <Route path="/tiktok/likes" element={<TikTokLikes user={user} />} />
            <Route path="/tiktok/views" element={<TikTokViews user={user} />} />
            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
