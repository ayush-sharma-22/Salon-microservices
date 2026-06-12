import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username, password) => {
    const res = await API.post('/auth/login', { username, password });
    return res.data;
  },
  signup: async (signupData) => {
    const res = await API.post('/auth/signup', signupData);
    return res.data;
  },
  getProfile: async () => {
    const res = await API.get('/api/users/profile');
    return res.data;
  },
};

export const salonAPI = {
  getAll: async () => {
    const res = await API.get('/api/salons');
    return res.data;
  },
  getById: async (id) => {
    const res = await API.get(`/api/salons/${id}`);
    return res.data;
  },
  searchByCity: async (city) => {
    const res = await API.get(`/api/salons/search?city=${city}`);
    return res.data;
  },
  getOwned: async () => {
    const res = await API.get('/api/salons/owner');
    return res.data;
  },
  create: async (data) => {
    const res = await API.post('/api/salons', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await API.put(`/api/salons/${id}`, data);
    return res.data;
  },
};

export const categoryAPI = {
  getAll: async () => {
    const res = await API.get('/api/categories');
    return res.data;
  },
  getBySalon: async (salonId) => {
    const res = await API.get(`/api/categories/salon/${salonId}`);
    return res.data;
  },
  getOwned: async () => {
    const res = await API.get('/api/categories/salon-owner');
    return res.data;
  },
  create: async (data) => {
    const res = await API.post('/api/categories/salon-owner', data);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/api/categories/salon-owner/${id}`);
    return res.data;
  },
};

export const serviceAPI = {
  getBySalon: async (salonId, categoryId) => {
    const url = categoryId 
      ? `/api/service-offering/salon/${salonId}?categoryId=${categoryId}`
      : `/api/service-offering/salon/${salonId}`;
    const res = await API.get(url);
    return res.data;
  },
  getByIds: async (ids) => {
    const idsString = Array.from(ids).join(',');
    const res = await API.get(`/api/service-offering/list?ids=${idsString}`);
    return res.data;
  },
  getById: async (id) => {
    const res = await API.get(`/api/service-offering/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await API.post('/api/service-offering/salon-owner', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await API.put(`/api/service-offering/salon-owner/${id}`, data);
    return res.data;
  },
};

export const bookingAPI = {
  create: async (salonId, paymentMethod, data) => {
    const res = await API.post(`/api/bookings?salonId=${salonId}&paymentMethod=${paymentMethod}`, data);
    return res.data; // returns PaymentLinkResponse
  },
  getCustomerBookings: async () => {
    const res = await API.get('/api/bookings/customer');
    return res.data;
  },
  getSalonBookings: async () => {
    const res = await API.get('/api/bookings/salon');
    return res.data;
  },
  getById: async (id) => {
    const res = await API.get(`/api/bookings/${id}`);
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await API.put(`/api/bookings/${id}?status=${status}`);
    return res.data;
  },
  getBookedSlots: async (salonId, date) => {
    const res = await API.get(`/api/bookings/slots/salon/${salonId}/date?date=${date}`);
    return res.data;
  },
  getReport: async () => {
    const res = await API.get('/api/bookings/report');
    return res.data;
  },
};

export const reviewAPI = {
  create: async (salonId, data) => {
    const res = await API.post(`/api/reviews/create/salon/${salonId}`, data);
    return res.data;
  },
  getBySalon: async (salonId) => {
    const res = await API.get(`/api/reviews/salon/${salonId}`);
    return res.data;
  },
  update: async (id, data) => {
    const res = await API.put(`/api/reviews/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/api/reviews/${id}`);
    return res.data;
  },
};

export const paymentAPI = {
  getById: async (paymentOrderId) => {
    const res = await API.get(`/api/payments/${paymentOrderId}`);
    return res.data;
  },
  proceed: async (paymentId, paymentLinkId) => {
    const res = await API.patch(`/api/payments/proceed?paymentId=${paymentId}&paymentLinkId=${paymentLinkId}`);
    return res.data;
  },
};

export const notificationAPI = {
  getByUser: async (userId) => {
    const res = await API.get(`/api/notifications/user/${userId}`);
    return res.data;
  },
  getBySalon: async (salonId) => {
    const res = await API.get(`/api/notifications/salon-owner/salon/${salonId}`);
    return res.data;
  },
  markAsRead: async (notificationId) => {
    const res = await API.patch(`/api/notifications/${notificationId}/read`);
    return res.data;
  },
};

export default API;
