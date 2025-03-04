import axios from "axios";

// Base URL for API calls - you can replace this with your actual API endpoint
const API_BASE_URL = "/api";

// Function to deploy a new instance
export const deployNewInstance = async (data) => {
  return await axios.post(`${API_BASE_URL}/new-instance`, data);
};

// Function to deploy to an existing instance
export const deployToExistingInstance = async (data) => {
  return await axios.post(`${API_BASE_URL}/existing-instance`, data);
};
