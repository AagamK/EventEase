import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../../types';
import { formatDate, calculateEventDuration } from '../../utils/helpers';
import { CalendarIcon, MapPinIcon, UsersIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              <Link to={`/events/${event.id}`}>{event.title}</Link>
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
            {event.status.replace('-', ' ')}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>{formatDate(event.startTime, 'MMM dd, yyyy')}</span>
            <span className="mx-2">•</span>
            <span>{calculateEventDuration(event.startTime, event.endTime)}</span>
          </div>

          {event.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-2" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {event.budget && (
            <div className="flex items-center text-sm text-gray-600">
              <CurrencyDollarIcon className="h-4 w-4 mr-2" />
              <span>Budget: ${event.budget.toLocaleString()}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600">
            <UsersIcon className="h-4 w-4 mr-2" />
            <span>{event.eventType}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Created {formatDate(event.createdAt, 'MMM dd')}
          </span>
          <div className="flex space-x-2">
            <Link
              to={`/events/${event.id}`}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View
            </Link>
            <Link
              to={`/events/${event.id}/edit`}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;