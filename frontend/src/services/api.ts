import axios from 'axios';
import { User, Event, Participant, Vendor, AIScheduleSuggestion } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials: { email: string; password: string }) =>
    api.post<{ user: User; token: string }>('/auth/login', credentials),
  
  register: (userData: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post<{ user: User; token: string }>('/auth/register', userData),
  
  getProfile: () => api.get<User>('/auth/profile'),
  
  updateProfile: (userData: Partial<User>) => api.put<User>('/auth/profile', userData),
};

export const eventService = {
  getEvents: () => api.get<Event[]>('/events'),
  
  getEvent: (id: number) => api.get<Event>(`/events/${id}`),
  
  createEvent: (eventData: Partial<Event>) => api.post<Event>('/events', eventData),
  
  updateEvent: (id: number, eventData: Partial<Event>) => api.put<Event>(`/events/${id}`, eventData),
  
  deleteEvent: (id: number) => api.delete(`/events/${id}`),
  
  getEventParticipants: (eventId: number) => api.get<Participant[]>(`/events/${eventId}/participants`),
  
  addParticipant: (eventId: number, participantData: Partial<Participant>) =>
    api.post<Participant>(`/events/${eventId}/participants`, participantData),
};

export const aiService = {
  generateSchedule: (eventId: number, constraints: any) =>
    api.post<AIScheduleSuggestion[]>(`/ai/events/${eventId}/schedule`, constraints),
  
  recommendVendors: (eventId: number, criteria: any) =>
    api.post<Vendor[]>(`/ai/events/${eventId}/vendors`, criteria),
  
  // FIXED: Changed 'id' to 'eventId'
  optimizeBudget: (eventId: number, budgetData: any) =>
    api.post<any>(`/ai/events/${eventId}/budget`, budgetData),
};

export const vendorService = {
  getVendors: (filters?: any) => api.get<Vendor[]>('/vendors', { params: filters }),
  
  getVendor: (id: number) => api.get<Vendor>(`/vendors/${id}`),
  
  searchVendors: (query: string) => api.get<Vendor[]>(`/vendors/search?q=${query}`),
};

export default api;