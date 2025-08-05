import React, { useEffect, useState } from "react"; // Corrected import statement
import { Link } from "react-router-dom";
import {
  Instagram,
  Youtube,
  Facebook,
  Heart,
  Shield,
  Zap,
  Users,
  Star,
  CheckCircle,
} from "lucide-react";

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "100% Safe & Secure",
      description:
        "We use the latest security measures to protect your account and personal information.",
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: "Instant Delivery",
      description:
        "Most orders start within minutes and are completed within 24 hours.",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Real Users",
      description:
        "We provide genuine followers and engagement from real, active users.",
    },
    {
      icon: <Heart className="h-8 w-8 text-purple-600" />,
      title: "24/7 Support",
      description:
        "Our dedicated support team is available round the clock to help you.",
    },
  ];

  const services = [
    {
      platform: "Instagram",
      // Brighter, more distinct pink-purple gradient for Instagram
      icon: <Instagram className="h-12 w-12 text-white" />, // Icon color changed to white for better contrast
      color: "from-pink-600 to-purple-700", // More vibrant gradient
      services: [
        { name: "Followers", path: "/instagram/followers" },
        { name: "Likes", path: "/instagram/likes" },
        { name: "Views", path: "/instagram/views" },
        { name: "Comments", path: "/instagram/comments" },
        { name: "Story Views", path: "/instagram/story-views" },
        { name: "Reels Views", path: "/instagram/reels-views" },
      ],
      link: "/instagram/followers", // Main link for the platform card
    },
    {
      platform: "YouTube",
      // Brighter, more distinct red gradient for YouTube
      icon: <Youtube className="h-12 w-12 text-white" />, // Icon color changed to white for better contrast
      color: "from-red-600 to-red-800", // More vibrant gradient
      services: [
        { name: "Subscribers", path: "/youtube/subscribers" },
        { name: "Views", path: "/youtube/views" },
        { name: "Likes", path: "/youtube/likes" },
        { name: "Shares", path: "/youtube/shares" },
        { name: "Watch Time", path: "/youtube/watch-time" },
        { name: "Live Stream", path: "/youtube/live-stream" },
      ],
      link: "/youtube/subscribers", // Main link for the platform card
    },
    {
      platform: "Facebook",
      // Brighter, more distinct blue gradient for Facebook
      icon: <Facebook className="h-12 w-12 text-white" />, // Icon color changed to white for better contrast
      color: "from-blue-600 to-blue-800", // More vibrant gradient
      services: [
        { name: "Followers", path: "/facebook/followers" },
        { name: "Likes", path: "/facebook/likes" },
        { name: "Page Likes", path: "/facebook/page-likes" },
        { name: "Female Followers", path: "/facebook/female-followers" },
        { name: "English Followers", path: "/facebook/english-followers" },
      ],
      link: "/facebook/followers", // Main link for the platform card
    },
    {
      platform: "TikTok",
      // Keeping black background for TikTok, but ensuring text is white for contrast
      icon: (
        <div className="h-12 w-12 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">
          {/* Increased font size for TT */}
          TT
        </div>
      ),
      color: "from-gray-900 to-black", // Slightly darker gray to black for depth
      services: [
        { name: "Followers", path: "/tiktok/followers" },
        { name: "Likes", path: "/tiktok/likes" },
        { name: "Views", path: "/tiktok/views" },
        { name: "Shares", path: "/tiktok/shares" },
        { name: "Comments", path: "/tiktok/comments" },
      ],
      link: "/tiktok/followers", // Main link for the platform card
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Influencer",
      content:
        "FollowerCarts helped me grow my Instagram from 1K to 100K followers in just 3 months! The quality is amazing.",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      name: "Mike Chen",
      role: "YouTube Creator",
      content:
        "The best investment I made for my channel. Real subscribers who actually engage with my content.",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      name: "Emma Davis",
      role: "Business Owner",
      content:
        "Our brand's social media presence exploded thanks to FollowerCarts. Highly recommend!",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Boost Your Social Media
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Presence Today
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
              Get real followers, likes, and engagement from genuine users.
              Trusted by over 1 million customers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/instagram/followers"
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
                onClick={scrollToTop} // Added onClick
              >
                Get Started Now
              </Link>
              <Link
                to="/blog"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-200"
                onClick={scrollToTop} // Added onClick
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1M+", label: "Happy Customers" },
              { number: "50M+", label: "Orders Delivered" },
              { number: "24/7", label: "Customer Support" },
              { number: "99.9%", label: "Uptime" },
            ].map((stat, index) => (
              <div
                key={index}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We support all major social media platforms with premium quality
              services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                <div
                  className={`bg-gradient-to-br ${service.color} p-6 text-white`}
                >
                  <div className="flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-center">
                    {service.platform}
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-2">
                    {/* Each service item is now a clickable Link */}
                    {service.services.map((item, idx) => (
                      <li key={idx}>
                        <Link
                          to={item.path} // Use the specific path for each service item
                          className="flex items-center text-gray-600 group-hover:text-purple-600 transition-colors duration-200 hover:underline"
                          onClick={scrollToTop} // Added onClick
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-col items-center space-y-3">
                    <Link
                      to={service.link}
                      className="text-purple-600 font-semibold hover:text-purple-800 transition-colors duration-200"
                      onClick={scrollToTop} // Added onClick
                    >
                      View All {service.platform} Services →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FollowerCarts?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're the trusted choice for social media growth with proven
              results
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group"
              >
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust FollowerCarts
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Grow Your Social Media?
          </h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Join over 1 million satisfied customers and start your social media
            growth journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/instagram/followers"
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              onClick={scrollToTop} // Added onClick
            >
              Start Growing Now
            </Link>
            <Link
              to="/track-order"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-200"
              onClick={scrollToTop} // Added onClick
            >
              Track Your Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
