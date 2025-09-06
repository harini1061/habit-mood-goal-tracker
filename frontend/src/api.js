import axios from 'axios';

// Use the environment variable from Vite
const API_BASE_URL = import.meta.env.VITE_API_URL; 

// Example: fetch moods
export const fetchMoods = async () => {
  const response = await axios.get(`${API_BASE_URL}/moods`);
  return response.data;
};