import React from 'react';
import { Instagram, Heart, Zap, Shield } from 'lucide-react';
import BuyNow from '../../../components/BuyNow';
import BuyNon from '../../../components/BuyNon';

const InstagramLikes = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
              <Heart className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Buy Instagram Likes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Boost your post engagement with instant Instagram likes. Increase visibility and attract more organic engagement.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <Zap className="h-8 w-8 text-purple-600" />,
              title: "Instant Delivery",
              description: "Likes start appearing within seconds of your order confirmation."
            },
            {
              icon: <Heart className="h-8 w-8 text-purple-600" />,
              title: "Real Engagement",
              description: "Get likes from genuine Instagram users with active profiles."
            },
            {
              icon: <Shield className="h-8 w-8 text-purple-600" />,
              title: "Safe & Secure",
              description: "100% safe service that protects your account and complies with Instagram policies."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Purchase Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Regular Packages</h2>
            <BuyNow service="Likes" platform="Instagram" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Non-Drop Premium</h2>
            <BuyNon service="Likes" platform="Instagram" />
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Why Buy Instagram Likes?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Boost Engagement</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Increase post visibility in feeds</li>
                <li>• Trigger Instagram algorithm</li>
                <li>• Attract more organic likes</li>
                <li>• Improve engagement rate</li>
                <li>• Build social proof</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Grow Your Presence</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Reach wider audience</li>
                <li>• Increase brand awareness</li>
                <li>• Attract potential customers</li>
                <li>• Build credible online presence</li>
                <li>• Accelerate organic growth</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramLikes;