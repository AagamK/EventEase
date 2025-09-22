import React, { useEffect, useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import { Event } from '../types';
import Calendar from '../components/common/Calendar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const CalendarView: React.FC = () => {
  const { events, getEvents, isLoading } = useEvents();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // You could show a modal or sidebar with events for that date
    console.log('Selected date:', date);
  };

  const handleEventClick = (event: Event) => {
    navigate(`/events/${event.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage your events in calendar format
          </p>
        </div>
        {selectedDate && (
          <div className="mt-4 sm:mt-0">
            <p className="text-sm text-gray-600">
              Selected: {selectedDate.toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Calendar Component */}
      <Calendar
        events={filteredEvents}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">{events.filter(e => new Date(e.startTime) > new Date()).length}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Upcoming Events</p>
              <p className="text-sm text-gray-500">Scheduled for future dates</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">{events.filter(e => new Date(e.startTime).toDateString() === new Date().toDateString()).length}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Today</p>
              <p className="text-sm text-gray-500">Events happening today</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold">{events.filter(e => new Date(e.startTime) < new Date() && e.status !== 'completed').length}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">This Week</p>
              <p className="text-sm text-gray-500">Events in the next 7 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;