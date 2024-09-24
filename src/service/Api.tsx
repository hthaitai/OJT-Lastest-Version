import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Create Axios instance with baseURL
const apiLink: AxiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

// Define a generic type for the API response
export const fetchData = async <T = any>(endpoint: string): Promise<T | { error: string }> => {
  try {
    const response: AxiosResponse<T> = await apiLink.get<T>(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    
    // Handle error appropriately
    const errorMessage = axios.isAxiosError(error) && error.response 
      ? error.response.data 
      : 'Error at fetching data';

    return { error: errorMessage as string };
  }
};
export const createData = async <T = any>(endpoint: string, data: T): Promise<T | { error: string }> => {
  try {
    const response: AxiosResponse<T> = await apiLink.post<T>(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error creating data', error);
    const errorMessage = axios.isAxiosError(error) && error.response 
      ? error.response.data 
      : 'Error at creating data';

    return { error: errorMessage as string };
  }
};