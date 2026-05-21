import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export type EventPayload = {
  id: number;
  name: string;
  description: string;
  quota: number;
  started_at: string;
  ended_at: string;
  created_at: string;
  updated_at: string;
};

export type AccountProfile = {
  id: number;
  user_id: number;
  role_id: number;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
};

export const authAPI = {
  login: (username: string, password: string) =>
    apiClient.post('/auth/login', { username, password }),

  register: (email: string, username: string, password: string) =>
    apiClient.post('/auth/register', { email, username, password }),

  me: () => apiClient.get<AccountProfile>('/auth/me'),
};

export const eventAPI = {
  getEvents: () =>
    apiClient.get<{
      code: number;
      message: string;
      data: {
        events: EventPayload[];
      };
    }>('/events/'),

  createEvent: (data: Omit<EventPayload, 'id' | 'created_at' | 'updated_at'>) =>
    apiClient.post<{
      code: number;
      message: string;
      data: EventPayload;
    }>('/events/', data),

  updateEvent: (eventId: number, data: Partial<Omit<EventPayload, 'id' | 'created_at' | 'updated_at'>>) =>
    apiClient.put<{
      code: number;
      message: string;
      data: EventPayload;
    }>(`/events/${eventId}/`, data),

  deleteEvent: (eventId: number) =>
    apiClient.delete<{
      code: number;
      message: string;
      data: null;
    }>(`/events/${eventId}/`),
};

export const adminAPI = {
  checkRole: () => apiClient.get('/roles/'),
};

export const registrationAPI = {
  register: (user_id: number, event_id: number) =>
    apiClient.post('/registrations/', { user_id, event_id }),
};

export default apiClient;