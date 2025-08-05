import React from 'react';
import { Facebook, Users, Globe, Star } from 'lucide-react';
import BuyNow from '../../../components/BuyNow';
import BuyNon from '../../../components/BuyNon';

const FacebookEnglishFollowers = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center">
              <Globe className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Buy Facebook English Followers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get English-speaking Facebook followers to boost engagement and reach English-speaking audiences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <BuyNow service="English Followers" platform="Facebook" />
          <BuyNon service="English Followers" platform="Facebook" />
        </div>
      </div>
    </div>
  );
};

export default FacebookEnglishFollowers;