import React, { useState } from 'react';
import { Event, Vendor } from '../../types';
import { aiService } from '../../services/api';
import { BuildingStorefrontIcon, StarIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface VendorRecommendationsProps {
  event: Event;
}

const VendorRecommendations: React.FC<VendorRecommendationsProps> = ({ event }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['Venue', 'Catering', 'Photography', 'Entertainment', 'Decoration'];

  const getRecommendations = async (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);
    try {
      const criteria = {
        category,
        budget: event.budget,
        location: event.location,
        eventType: event.eventType,
        attendees: 50 // Default estimate
      };
      
      const response = await aiService.recommendVendors(event.id, criteria);
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendor recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BuildingStorefrontIcon className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Vendor Recommendations</h3>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">
            Get AI-powered vendor recommendations based on your event requirements and budget.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => getRecommendations(category)}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-sm text-gray-500">
              Finding the best {selectedCategory.toLowerCase()} vendors for your event...
            </p>
          </div>
        )}

        {vendors.length > 0 && !isLoading && (
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Top {selectedCategory} Recommendations
            </h4>
            <div className="space-y-4">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h5 className="font-medium text-gray-900">{vendor.name}</h5>
                        {renderStars(vendor.rating)}
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{vendor.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <PhoneIcon className="h-4 w-4" />
                          <span>{vendor.phone}</span>
                        </div>
                        <div>
                          <span className="font-medium">Price Range:</span> {vendor.priceRange}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <button className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
                        Contact
                      </button>
                      <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vendors.length === 0 && !isLoading && selectedCategory && (
          <div className="text-center py-8 text-gray-500">
            <BuildingStorefrontIcon className="mx-auto h-12 w-12 mb-4" />
            <p>No vendors found for {selectedCategory}. Try a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorRecommendations;