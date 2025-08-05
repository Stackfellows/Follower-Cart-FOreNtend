import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll for a better user experience
    });
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">
              FollowerCarts
            </h3>
            <p className="text-gray-300 mb-4">
              The most trusted social media marketing platform. Boost your
              social presence with high-quality followers, likes, and
              engagement.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                onClick={scrollToTop}
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                onClick={scrollToTop}
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                onClick={scrollToTop}
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                onClick={scrollToTop}
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Popular Services</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/instagram/followers"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  onClick={scrollToTop}
                >
                  Instagram Followers
                </Link>
              </li>
              <li>
                <Link
                  to="/youtube/subscribers"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  onClick={scrollToTop}
                >
                  YouTube Subscribers
                </Link>
              </li>
              <li>
                <Link
                  to="/tiktok/followers"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  onClick={scrollToTop}
                >
                  TikTok Followers
                </Link>
              </li>
              <li>
                <Link
                  to="/facebook/likes"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  onClick={scrollToTop}
                >
                  Facebook Likes
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                {/* Changed to /faq, assuming you might have a separate FAQ page */}
                <Link
                  to="/faq"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  onClick={scrollToTop}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  onClick={scrollToTop}
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  onClick={scrollToTop}
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@followercarts.com"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  onClick={scrollToTop}
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  onClick={scrollToTop}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                {/* Changed to /terms-of-service for clarity */}
                <Link
                  to="/terms-of-service"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  onClick={scrollToTop}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/blog" // Link to the new Blog page
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  onClick={scrollToTop}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/order" // Link to the new Owner Profile page
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  onClick={scrollToTop}
                >
                  Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 FollowerCarts. All rights reserved. Made with ❤️ for social
            media growth.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
