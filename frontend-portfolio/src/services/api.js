import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API functions
export const getPersonalInfo = async () => {
  const response = await api.get('/personal');
  return response.data.data;
};

export const getAbout = async () => {
  const response = await api.get('/about');
  return response.data.data;
};

export const getSkills = async () => {
  const response = await api.get('/skills');
  return response.data.data;
};

export const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data.data;
};

export const getContact = async () => {
  const response = await api.get('/contact');
  return response.data.data;
};

export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data.data;
};

export const submitContactMessage = async (messageData) => {
  const response = await api.post('/contact/messages', messageData);
  return response.data;
};

export const trackVisitor = async () => {
  try {
    const response = await api.post('/visitors/track');
    return response.data;
  } catch (error) {
    console.error('Error tracking visitor:', error);
    // Don't throw error - visitor tracking shouldn't break the app
    return null;
  }
};

export default api;
