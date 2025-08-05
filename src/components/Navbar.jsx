import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(null);
  const [mobileServiceDropdownOpen, setMobileServiceDropdownOpen] =
    useState(null);
  const navigate = useNavigate();
  const dropdownTimeoutRef = useRef(null); // Ref to hold the timeout ID

  const handleLogout = () => {
    onLogout();
    navigate("/");
    setIsOpen(false);
    setDesktopDropdownOpen(null);
    setMobileServiceDropdownOpen(null);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
    setMobileServiceDropdownOpen(null);
  };

  const closeAllDesktopDropdowns = () => {
    setDesktopDropdownOpen(null);
  };

  const services = {
    Instagram: [
      { name: "Buy Followers", path: "/instagram/followers" },
      { name: "Buy Likes", path: "/instagram/likes" },
      { name: "Buy Views", path: "/instagram/views" },
      { name: "Buy Reels Views", path: "/instagram/reels-views" },
      { name: "Buy Story Views", path: "/instagram/story-views" },
      { name: "Buy Comments", path: "/instagram/comments" },
    ],
    YouTube: [
      { name: "Buy Subscribers", path: "/youtube/subscribers" },
      { name: "Buy Views", path: "/youtube/views" },
      { name: "Buy Likes", path: "/youtube/likes" },
      { name: "Buy Shares", path: "/youtube/shares" },
      { name: "Buy Watch Time", path: "/youtube/watch-time" },
      { name: "Buy Live Stream", path: "/youtube/live-stream" },
    ],
    Facebook: [
      { name: "Buy Followers", path: "/facebook/followers" },
      { name: "Buy Likes", path: "/facebook/likes" },
      { name: "Female Followers", path: "/facebook/female-followers" },
      { name: "English Followers", path: "/facebook/english-followers" },
      { name: "Page Likes", path: "/facebook/page-likes" },
    ],
    TikTok: [
      { name: "Buy Followers", path: "/tiktok/followers" },
      { name: "Buy Likes", path: "/tiktok/likes" },
      { name: "Buy Views", path: "/tiktok/views" },
    ],
  };

  // Function to handle opening a desktop dropdown
  const handleMouseEnter = (platform) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setDesktopDropdownOpen(platform);
  };

  // Function to handle closing a desktop dropdown with a delay
  const handleMouseLeave = () => {
    scrollToTop();
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    dropdownTimeoutRef.current = setTimeout(() => {
      closeAllDesktopDropdowns();
    }, 3000); // 5000 milliseconds = 5 seconds
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center"
              onClick={() => {
                scrollToTop();
                closeMobileMenu();
                closeAllDesktopDropdowns();
              }}
            >
              <span className="text-2xl font-bold text-purple-600">
                Follower Carts
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-purple-600 transition-colors duration-200"
              onClick={() => {
                scrollToTop();
                closeAllDesktopDropdowns();
              }}
            >
              Home
            </Link>

            {/* Services Dropdown (Desktop) */}
            {Object.keys(services).map((platform) => (
              <div
                key={platform}
                className="relative"
                onMouseEnter={() => handleMouseEnter(platform)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center text-gray-700 hover:text-purple-600 transition-colors duration-200">
                  {platform}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {desktopDropdownOpen === platform && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    {services[platform].map((service) => (
                      <Link
                        key={service.path}
                        to={service.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        onClick={() => {
                          scrollToTop();
                          closeAllDesktopDropdowns();
                        }}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              to="/order"
              className="text-gray-700 hover:text-purple-600 transition-colors duration-200"
              onClick={() => {
                scrollToTop();
                closeAllDesktopDropdowns();
              }}
            >
              Orders
            </Link>
            <Link
              to="/track-order"
              className="text-gray-700 hover:text-purple-600 transition-colors duration-200"
              onClick={() => {
                scrollToTop();
                closeAllDesktopDropdowns();
              }}
            >
              Track Order
            </Link>

            {/* User Menu (Desktop) */}
            {user ? (
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("user")}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center text-gray-700 hover:text-purple-600 transition-colors duration-200">
                  <User className="h-4 w-4 mr-1" />
                  {user.name}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {desktopDropdownOpen === "user" && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    <Link
                      to={
                        user.role === "admin"
                          ? "/admin-dashboard"
                          : "/client-dashboard"
                      }
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                      onClick={() => {
                        scrollToTop();
                        closeAllDesktopDropdowns();
                      }}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200"
                onClick={() => {
                  scrollToTop();
                  closeAllDesktopDropdowns();
                }}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button and Login/User in header */}
          <div className="md:hidden flex items-center space-x-4">
            {user ? (
              <Link
                to={
                  user.role === "admin"
                    ? "/admin-dashboard"
                    : "/client-dashboard"
                }
                className="text-gray-700 hover:text-purple-600 transition-colors duration-200"
                onClick={() => {
                  scrollToTop();
                  closeMobileMenu();
                  closeAllDesktopDropdowns();
                }}
              >
                <User className="h-6 w-6" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 transition-colors duration-200"
                onClick={() => {
                  scrollToTop();
                  closeMobileMenu();
                  closeAllDesktopDropdowns();
                }}
              >
                Login
              </Link>
            )}
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                closeAllDesktopDropdowns();
              }}
              className="text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu (Collapsible) */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600"
                onClick={() => {
                  scrollToTop();
                  closeMobileMenu();
                }}
              >
                Home
              </Link>

              {/* Services Dropdown (Mobile) */}
              {Object.keys(services).map((platform) => (
                <div key={platform}>
                  <button
                    className="flex items-center justify-between w-full px-3 py-2 text-gray-900 font-semibold hover:text-purple-600"
                    onClick={() =>
                      setMobileServiceDropdownOpen(
                        mobileServiceDropdownOpen === platform ? null : platform
                      )
                    }
                  >
                    {platform}
                    <ChevronDown
                      className={`h-4 w-4 transform transition-transform duration-200 ${
                        mobileServiceDropdownOpen === platform
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                  {mobileServiceDropdownOpen === platform && (
                    <div className="pl-6 pt-1 pb-1 space-y-1">
                      {services[platform].map((service) => (
                        <Link
                          key={service.path}
                          to={service.path}
                          className="block px-3 py-2 text-sm text-gray-700 hover:text-purple-600"
                          onClick={() => {
                            scrollToTop();
                            closeMobileMenu();
                          }}
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link
                to="/order"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600"
                onClick={() => {
                  scrollToTop();
                  closeMobileMenu();
                }}
              >
                Orders
              </Link>
              <Link
                to="/track-order"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600"
                onClick={() => {
                  scrollToTop();
                  closeMobileMenu();
                }}
              >
                Track Order
              </Link>

              {/* Only Dashboard and Logout within collapsible mobile menu */}
              {user && (
                <>
                  <Link
                    to={
                      user.role === "admin"
                        ? "/admin-dashboard"
                        : "/client-dashboard"
                    }
                    className="block px-3 py-2 text-gray-700 hover:text-purple-600"
                    onClick={() => {
                      scrollToTop();
                      closeMobileMenu();
                    }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
