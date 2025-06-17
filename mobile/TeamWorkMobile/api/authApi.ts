import { apiRequest, storeToken, storeUser, removeToken, removeUser } from './apiUtils';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface VerificationData {
  code: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface NewPasswordData {
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: any;
  token?: string;
}

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiRequest('/auth/login', 'POST', credentials, false);
    
    if (response.success && response.token) {
      await storeToken(response.token);
      await storeUser(response.user);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Register new user
export const signup = async (userData: SignupData): Promise<AuthResponse> => {
  try {
    const response = await apiRequest('/auth/signup', 'POST', userData, false);
    
    if (response.success && response.token) {
      await storeToken(response.token);
      await storeUser(response.user);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Verify email with code
export const verifyEmail = async (verificationData: VerificationData): Promise<AuthResponse> => {
  try {
    const response = await apiRequest('/auth/verify-email', 'POST', verificationData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Request password reset
export const forgotPassword = async (resetData: ResetPasswordData): Promise<AuthResponse> => {
  try {
    const response = await apiRequest('/auth/forgot-password', 'POST', resetData, false);
    return response;
  } catch (error) {
    throw error;
  }
};

// Reset password with token
export const resetPassword = async (token: string, passwordData: NewPasswordData): Promise<AuthResponse> => {
  try {
    const response = await apiRequest(`/auth/reset-password/${token}`, 'POST', passwordData, false);
    return response;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    // Try to notify the server, but don't wait for a response
    apiRequest('/auth/logout', 'POST').catch(error => {
      console.log('Server logout notification failed, but continuing with local logout:', error);
    });
    
    // Always clear local storage regardless of server response
    await removeToken();
    await removeUser();
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove tokens even if API call fails
    await removeToken();
    await removeUser();
  }
};

// Check if user is authenticated
export const checkAuth = async (): Promise<AuthResponse> => {
  try {
    return await apiRequest('/auth/check-auth', 'GET');
  } catch (error) {
    throw error;
  }
};

// Resend verification code
export const resendVerification = async (): Promise<AuthResponse> => {
  try {
    const response = await apiRequest('/auth/resend-verification', 'POST');
    return response;
  } catch (error) {
    throw error;
  }
};
