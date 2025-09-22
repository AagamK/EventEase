export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  eventType: string;
  startTime: string;
  endTime: string;
  timezone: string;
  location: string;
  budget: number;
  userId: number;
  status: 'draft' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: number;
  eventId: number;
  email: string;
  name: string;
  status: 'pending' | 'accepted' | 'declined';
  availability: Record<string, string[]>;
}

export interface Vendor {
  id: number;
  name: string;
  category: string;
  email: string;
  phone: string;
  priceRange: string;
  rating: number;
  location: string;
  imageUrl?: string;
}

export interface AIScheduleSuggestion {
  startTime: string;
  endTime: string;
  confidence: number;
  reason: string;
  participantAvailability: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface EventState {
  events: Event[];
  currentEvent: Event | null;
  isLoading: boolean;
  error: string | null;
}

// Add the missing constants - THIS IS WHAT WAS MISSING
export const EVENT_TYPES = [
  'Wedding',
  'Conference',
  'Meeting',
  'Birthday Party',
  'Corporate Event',
  'Networking',
  'Workshop',
  'Seminar',
  'Product Launch',
  'Team Building',
  'Other'
];

export const VENDOR_CATEGORIES = [
  'Venue',
  'Catering',
  'Photography',
  'Entertainment',
  'Decoration',
  'Audio/Visual',
  'Transportation',
  'Accommodation',
  'Other'
];

export const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney'
];

export const BUDGET_CATEGORIES = [
  'Venue',
  'Food & Beverage',
  'Entertainment',
  'Decorations',
  'Staff',
  'Marketing',
  'Technology',
  'Transportation',
  'Miscellaneous'
];