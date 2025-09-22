import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents'; // Fixed import
import { useAuth } from '../hooks/useAuth';
import { CalendarIcon, PlusIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import EventCard from '../components/events/EventCard';
import StatsCard from '../components/common/StatsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const Dashboard: React.FC = () => {
  const { events, getEvents, isLoading } = useEvents(); // Fixed hook usage
  const { user } = useAuth();

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const upcomingEvents = events
    .filter(event => new Date(event.startTime) > new Date())
    .slice(0, 3);

  const totalBudget = events.reduce((sum, event) => sum + (event.budget || 0), 0);
  const completedEvents = events.filter(event => event.status === 'completed').length;

  const stats = [
    {
      title: 'Total Events',
      value: events.length,
      icon: CalendarIcon,
      description: 'All your events'
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: UserGroupIcon,
      description: 'Events in next 30 days'
    },
    {
      title: 'Completed',
      value: completedEvents,
      icon: CalendarIcon,
      description: 'Successfully completed'
    },
    {
      title: 'Total Budget',
      value: `$${totalBudget.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      description: 'Across all events'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-blue-100">
          You have {upcomingEvents.length} upcoming events. Stay organized with EventEase.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <Link
              to="/events/new"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New Event
            </Link>
          </div>
        </div>

        <div className="p-6">
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarIcon}
              title="No upcoming events"
              description="Get started by creating your first event."
              action={
                <Link
                  to="/events/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Event
                </Link>
              }
            />
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/events"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <CalendarIcon className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View All Events</h3>
          <p className="text-gray-600">See your complete event calendar and manage all events.</p>
        </Link>

        <Link
          to="/calendar"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <CalendarIcon className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar View</h3>
          <p className="text-gray-600">Visualize your events in a monthly calendar format.</p>
        </Link>

        <Link
          to="/vendors"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <UserGroupIcon className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Vendors</h3>
          <p className="text-gray-600">Discover and connect with trusted event vendors.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;