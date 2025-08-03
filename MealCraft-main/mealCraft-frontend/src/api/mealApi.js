import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Attach JWT token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Get all meal items
export const fetchAllMeals = () => {
  return API.get('/meals');
};

// ✅ Get meals by type: base, protein, veggie, extra
export const fetchMealsByType = (type) => {
  return API.get(`/meals/${type}`);
};

// ✅ Add a new meal item (admin only)
export const addMeal = (mealData) => {
  return API.post('/meals/add', mealData);
};

// ✅ Search meals by name (fixed: uses `name` not `query`)
export const searchMeals = (name) => {
  return API.get('/meals/search', {
    params: { name }
  });
};

export default API;
