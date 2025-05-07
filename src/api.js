import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.241.148.118:3000/api/dogs',
});

export default api;
