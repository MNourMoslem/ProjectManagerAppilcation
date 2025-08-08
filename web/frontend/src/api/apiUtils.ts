// Base URL for API calls - use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
export const apiCall = async (endpoint: string, method: string = 'GET', body?: any) => {
  // Try both token keys for compatibility
  const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
  
  // Debug logging for production issues
  console.log('API Call Debug:', {
    endpoint,
    method,
    hasToken: !!token,
    tokenSource: localStorage.getItem('auth-token') ? 'auth-token' : 
                 localStorage.getItem('token') ? 'token' : 'none',
    tokenPreview: token ? `${token.substring(0, 10)}...` : 'none',
    apiBaseUrl: API_BASE_URL,
    fullUrl: `${API_BASE_URL}${endpoint}`,
    environment: import.meta.env.VITE_NODE_ENV || 'development'
  });
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };
  
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    // Debug log response
    console.log('API Response Debug:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url
    });
    
    // Check if the response is OK
    if (!response.ok) {
      // Try to parse the error message from the response
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('API Error Response:', errorData);
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    // For NoContent responses
    if (response.status === 204) {
      return { success: true };
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};