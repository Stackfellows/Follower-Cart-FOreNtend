import React from 'react';
import { Instagram, Eye, Clock, Users } from 'lucide-react';
import BuyNow from '../../../components/BuyNow';
import BuyNon from '../../../components/BuyNon';

const InstagramStoryViews = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
              <Eye className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Buy Instagram Story Views
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Increase your Instagram Story views and boost your daily engagement with real viewers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <BuyNow service="Story Views" platform="Instagram" />
          <BuyNon service="Story Views" platform="Instagram" />
        </div>
      </div>
    </div>
  );
};

export default InstagramStoryViews;