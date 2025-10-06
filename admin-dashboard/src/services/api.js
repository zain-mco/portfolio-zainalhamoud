import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Personal API
export const personalAPI = {
  get: async () => {
    const response = await api.get('/personal');
    return response.data.data;
  },
  update: async (data) => {
    const response = await api.put('/personal', data);
    return response.data.data;
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/personal/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  }
};

// About API
export const aboutAPI = {
  get: async () => {
    const response = await api.get('/about');
    return response.data.data;
  },
  update: async (data) => {
    const response = await api.put('/about', data);
    return response.data.data;
  },
  addExperience: async (data) => {
    const response = await api.post('/about/experience', data);
    return response.data.data;
  },
  updateExperience: async (id, data) => {
    const response = await api.put(`/about/experience/${id}`, data);
    return response.data.data;
  },
  deleteExperience: async (id) => {
    const response = await api.delete(`/about/experience/${id}`);
    return response.data.data;
  },
  addEducation: async (data) => {
    const response = await api.post('/about/education', data);
    return response.data.data;
  },
  updateEducation: async (id, data) => {
    const response = await api.put(`/about/education/${id}`, data);
    return response.data.data;
  },
  deleteEducation: async (id) => {
    const response = await api.delete(`/about/education/${id}`);
    return response.data.data;
  },
  addCertification: async (data) => {
    const response = await api.post('/about/certification', data);
    return response.data.data;
  },
  updateCertification: async (id, data) => {
    const response = await api.put(`/about/certification/${id}`, data);
    return response.data.data;
  },
  deleteCertification: async (id) => {
    const response = await api.delete(`/about/certification/${id}`);
    return response.data.data;
  }
};

// Skills API
export const skillsAPI = {
  getAll: async () => {
    const response = await api.get('/skills');
    return response.data.data;
  },
  create: async (data) => {
    const response = await api.post('/skills', data);
    return response.data.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/skills/${id}`, data);
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },
  reorder: async (skills) => {
    const response = await api.put('/skills/reorder', { skills });
    return response.data;
  },
  updateAdditional: async (technologies) => {
    const response = await api.put('/skills/additional', { technologies });
    return response.data.data;
  },
  // Category management
  getCategories: async () => {
    const response = await api.get('/skills/categories');
    return response.data.data;
  },
  createCategory: async (data) => {
    const response = await api.post('/skills/categories', data);
    return response.data.data;
  },
  updateCategory: async (id, data) => {
    const response = await api.put(`/skills/categories/${id}`, data);
    return response.data.data;
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/skills/categories/${id}`);
    return response.data;
  },
  reorderCategories: async (categories) => {
    const response = await api.put('/skills/categories/reorder', { categories });
    return response.data;
  }
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data.data;
  },
  create: async (data) => {
    const response = await api.post('/projects', data);
    return response.data.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/projects/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },
  reorder: async (projects) => {
    const response = await api.put('/projects/reorder', { projects });
    return response.data;
  }
};

// Contact API
export const contactAPI = {
  get: async () => {
    const response = await api.get('/contact');
    return response.data.data;
  },
  update: async (data) => {
    const response = await api.put('/contact', data);
    return response.data.data;
  },
  getMessages: async () => {
    const response = await api.get('/contact/messages');
    return response.data.data;
  },
  markAsRead: async (id) => {
    const response = await api.put(`/contact/messages/${id}/read`);
    return response.data.data;
  },
  deleteMessage: async (id) => {
    const response = await api.delete(`/contact/messages/${id}`);
    return response.data;
  }
};

// Settings API
export const settingsAPI = {
  get: async () => {
    const response = await api.get('/settings');
    return response.data.data;
  },
  update: async (data) => {
    const response = await api.put('/settings', data);
    return response.data.data;
  }
};

// Visitors API
export const visitorsAPI = {
  getStats: async () => {
    const response = await api.get('/visitors/stats');
    return response.data.data;
  },
  getRecent: async (limit = 50) => {
    const response = await api.get(`/visitors/recent?limit=${limit}`);
    return response.data.data;
  }
};

export default api;
