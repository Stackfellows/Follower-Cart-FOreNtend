import React from 'react';
import { Instagram, Users, Star, TrendingUp } from 'lucide-react';
import BuyNow from '../../../components/BuyNow';
import BuyNon from '../../../components/BuyNon';

const InstagramFollowers = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Instagram className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Buy Instagram Followers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Boost your Instagram presence with real, active followers. Increase your credibility and reach with our premium follower packages.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <Users className="h-8 w-8 text-purple-600" />,
              title: "Real Active Users",
              description: "Get followers from genuine, active Instagram accounts that engage with content."
            },
            {
              icon: <Star className="h-8 w-8 text-purple-600" />,
              title: "High Quality",
              description: "Premium followers with profile pictures, posts, and authentic engagement patterns."
            },
            {
              icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
              title: "Instant Growth",
              description: "See your follower count increase within minutes of placing your order."
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
            <BuyNow service="Followers" platform="Instagram" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Non-Drop Premium</h2>
            <BuyNon service="Followers" platform="Instagram" />
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Why Buy Instagram Followers?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits for Businesses</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Increase brand credibility and trust</li>
                <li>• Attract more organic followers</li>
                <li>• Improve social proof for customers</li>
                <li>• Boost engagement rates</li>
                <li>• Enhance marketing ROI</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits for Influencers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Qualify for brand partnerships</li>
                <li>• Increase earning potential</li>
                <li>• Build a strong personal brand</li>
                <li>• Gain competitive advantage</li>
                <li>• Accelerate growth trajectory</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Are the followers real?",
                answer: "Yes, we provide real Instagram followers from active accounts with profile pictures and posts."
              },
              {
                question: "How fast will I receive followers?",
                answer: "Followers start appearing within 15-30 minutes and complete delivery typically takes 1-24 hours."
              },
              {
                question: "Is it safe for my account?",
                answer: "Absolutely! Our service is 100% safe and complies with Instagram's terms of service."
              },
              {
                question: "Do you offer refill guarantee?",
                answer: "Yes, we provide a 30-day refill guarantee to maintain your follower count."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramFollowers;