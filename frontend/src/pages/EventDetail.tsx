import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Event, Participant } from '../types';
import { eventService } from '../services/api';
import { formatDate, calculateEventDuration } from '../utils/helpers';
import { 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AIScheduler from '../components/ai/AIScheduler';
import VendorRecommendations from '../components/ai/VendorRecommendations';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const eventResponse = await eventService.getEvent(parseInt(id));
        const participantsResponse = await eventService.getEventParticipants(parseInt(id));
        
        setEvent(eventResponse.data);
        setParticipants(participantsResponse.data);
      } catch (error) {
        console.error('Error fetching event data:', error);
        navigate('/events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [id, navigate]);

  const handleDeleteEvent = async () => {
    if (!event || !window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventService.deleteEvent(event.id);
      navigate('/events');
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  if (isLoading) {
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
        <Link to="/events" className="text-blue-600 hover:text-blue-500">
          Back to events
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'participants', name: `Participants (${participants.length})` },
    { id: 'schedule', name: 'Schedule' },
    { id: 'vendors', name: 'Vendors' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/events"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            <p className="text-sm text-gray-600">Event ID: {event.id}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link
            to={`/events/${event.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDeleteEvent}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Event Status Badge */}
      <div className="flex items-center space-x-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          event.status === 'scheduled' ? 'bg-green-100 text-green-800' :
          event.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
          event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
          event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {event.status.replace('-', ' ')}
        </span>
        <span className="text-sm text-gray-600">
          Created {formatDate(event.createdAt, 'MMM dd, yyyy')}
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Event Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                    <p className="mt-1 text-sm text-gray-900">{event.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Event Type</h4>
                      <p className="mt-1 text-sm text-gray-900">{event.eventType}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Timezone</h4>
                      <p className="mt-1 text-sm text-gray-900">{event.timezone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatDate(event.startTime, 'EEEE, MMMM dd, yyyy')}
                      </p>
                      <p>
                        {formatDate(event.startTime, 'h:mm a')} - {formatDate(event.endTime, 'h:mm a')}
                        {' '}({calculateEventDuration(event.startTime, event.endTime)})
                      </p>
                    </div>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-5 w-5 mr-3 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Budget */}
              {event.budget && (
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Budget</h3>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${event.budget.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Total allocated budget</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Participants Summary */}
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Participants</h3>
                <div className="flex items-center">
                  <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{participants.length}</p>
                    <p className="text-sm text-gray-600">Total participants</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-semibold text-green-600">
                      {participants.filter(p => p.status === 'accepted').length}
                    </p>
                    <p className="text-xs text-gray-600">Accepted</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-yellow-600">
                      {participants.filter(p => p.status === 'pending').length}
                    </p>
                    <p className="text-xs text-gray-600">Pending</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-red-600">
                      {participants.filter(p => p.status === 'declined').length}
                    </p>
                    <p className="text-xs text-gray-600">Declined</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <AIScheduler event={event} participants={participants} />
        )}

        {activeTab === 'vendors' && (
          <VendorRecommendations event={event} />
        )}

        {activeTab === 'participants' && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Participants</h3>
            </div>
            <div className="p-6">
              {/* Participants list implementation would go here */}
              <p>Participants management interface coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;