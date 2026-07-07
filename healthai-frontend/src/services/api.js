import axios from 'axios';

// Yahan humne direct URLs hardcode kar diye hain taaki Docker compile ke waqt fallback ka koi lafda na rahe
const JAVA_API = 'http://localhost:8081';
const AI_API = 'http://localhost:8085';

// Axios instance — Java Backend
const javaApi = axios.create({
  baseURL: JAVA_API,
  headers: { 'Content-Type': 'application/json' } // <--- withCredentials: true hata diya h yahan se
});

// Axios instance — AI Service
const aiApi = axios.create({
  baseURL: AI_API,
  headers: { 'Content-Type': 'application/json' } // <--- withCredentials: true hata diya h yahan se
});

// Token interceptor — har request mein token add karo
javaApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — 401 pe logout karo
javaApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => javaApi.post('/auth/register', data),
  login: (data) => javaApi.post('/auth/login', data),
  logout: () => javaApi.post('/auth/logout'),
  profile: () => javaApi.get('/auth/profile'),
};

// User APIs
export const userAPI = {
  getProfile: () => javaApi.get('/user/profile'),
  saveHealth: (data) => javaApi.post('/user/health', data),
  updateProfile: (name) => javaApi.put(`/user/profile?name=${name}`),
};

// Workout APIs
export const workoutAPI = {
  log: (data) => javaApi.post('/workout/log', data),
  today: () => javaApi.get('/workout/today'),
  all: () => javaApi.get('/workout/all'),
  stats: () => javaApi.get('/workout/stats'),
  progress: (start, end) => javaApi.get(`/workout/progress?startDate=${start}&endDate=${end}`),
  delete: (id) => javaApi.delete(`/workout/${id}`),
};

// AI APIs
export const aiAPI = {
  recommend: (data) => aiApi.post('/ai/recommend', data),
  chat: (data) => aiApi.post('/ai/chat', data),
  tips: (goal) => aiApi.get(`/ai/health-tips/${goal}`),
};

export { javaApi, aiApi };