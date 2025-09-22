import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { Event } from '../types';
import EventForm from '../components/events/EventForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { createEvent, isLoading } = useEvents();

  const handleSubmit = async (eventData: Partial<Event>) => {
    try {
      await createEvent(eventData);
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleCancel = () => {
    navigate('/events');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-sm text-gray-600">Fill in the details to create your event</p>
        </div>
      </div>

      {/* Event Form */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="p-6">
          <EventForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* AI Assistance Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">AI Assistance Available</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                After creating your event, you can use our AI tools to:
              </p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Find optimal scheduling based on participant availability</li>
                <li>Get vendor recommendations based on your budget</li>
                <li>Receive budget optimization suggestions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;