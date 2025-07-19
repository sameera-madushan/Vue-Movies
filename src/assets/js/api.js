import axios from "axios";
import { toast } from 'vue3-toastify';

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const axiosInstance = axios.create({
  headers: {
    'Authorization': API_TOKEN
  },
  params: {
    language: 'en-US'
  }
});

const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    toast.error('An error occurred while fetching data. Please try again later.');
    throw error;
  }
};

export const fetchMovieDb = (params, url) => {
  return handleRequest(axiosInstance.get(url, { params }));
};

export const fetchRaw = (fullUrl) => {
  return handleRequest(axiosInstance.get(fullUrl));
};

export default {
  fetchMovieDb,
  fetchRaw
};