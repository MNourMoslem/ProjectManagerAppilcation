import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL - configure based on your environment
// For development with local backend:
export const API_URL = 'http://localhost:5000/api';
// For Android emulator pointing to localhost:
// export const API_URL = 'http://10.0.2.2:5000/api';
// For physical device, use your computer's IP address:
// export const API_URL = 'http://192.168.1.100:5000/api';

// Token storage keys
export const TOKEN_KEY = 'teamwork_auth_token';
export const USER_KEY = 'teamwork_user';

// Store token in AsyncStorage
export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

// Get token from AsyncStorage
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Remove token from AsyncStorage
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Store user data in AsyncStorage
export const storeUser = async (user: any) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user:', error);
  }
};

// Get user data from AsyncStorage
export const getUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Remove user data from AsyncStorage
export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

// Helper to handle API responses
export const handleApiResponse = async (response: Response) => {
  const data = await response.json().catch(error => {
    console.error('Error parsing JSON response:', error);
    throw new Error('Invalid response from server');
  });
  
  if (!response.ok) {
    console.error('API Error Response:', { status: response.status, data });
    throw new Error(data.message || `Error: ${response.status}`);
  }
  
  return data;
};

// API request with authorization header
export const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  body?: any,
  includeToken: boolean = true
) => {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeToken) {
      const token = await getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    console.log(`API Request: ${method} ${API_URL}${endpoint}`, { options });
    
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await handleApiResponse(response);
    
    console.log(`API Response: ${method} ${endpoint}`, { status: response.status, result });
    
    return result;
  } catch (error) {
    console.error(`API Request Error: ${method} ${endpoint}`, error);
    throw error;
  }
};
