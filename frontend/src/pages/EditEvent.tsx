import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { eventService } from '../services/api';
import { useEvents } from '../hooks/useEvents';
import EventForm from '../components/events/EventForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateEvent, isLoading } = useEvents();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        const response = await eventService.getEvent(parseInt(id));
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        navigate('/events');
      } finally {
        setIsLoadingEvent(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleSubmit = async (eventData: Partial<Event>) => {
    if (!event) return;
    
    try {
      await updateEvent(event.id, eventData);
      navigate(`/events/${event.id}`);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleCancel = () => {
    if (event) {
      navigate(`/events/${event.id}`);
    } else {
      navigate('/events');
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">Event not found</h2>
        <button
          onClick={() => navigate('/events')}
          className="text-blue-600 hover:text-blue-500"
        >
          Back to events
        </button>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-sm text-gray-600">Update the details of your event</p>
        </div>
      </div>

      {/* Event Form */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="p-6">
          <EventForm
            event={event}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default EditEvent;