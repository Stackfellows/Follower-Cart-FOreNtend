import React from 'react';
import { Users, Star, TrendingUp, Zap } from 'lucide-react';
import BuyNow from '../../../components/BuyNow';
import BuyNon from '../../../components/BuyNon';

const TikTokFollowers = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center">
              <div className="text-white font-bold text-xl">TT</div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Buy TikTok Followers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Grow your TikTok presence with real followers. Increase your reach and go viral with our premium services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <BuyNow service="Followers" platform="TikTok" />
          <BuyNon service="Followers" platform="TikTok" />
        </div>
      </div>
    </div>
  );
};

export default TikTokFollowers;