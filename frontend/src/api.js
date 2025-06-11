import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Backend URL

export const fetchMoods = async () => {
  const response = await axios.get(`${API_BASE_URL}/moods`);
  return response.data;
};
