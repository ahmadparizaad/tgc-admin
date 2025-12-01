import { API_BASE_URL, TOKEN_KEYS } from '@/shared/constants';
import type { ClientResponse } from '@/shared/types';

/**
 * Get stored access token
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
};

/**
 * Store tokens
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
};

/**
 * Clear tokens
 */
export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/admin/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const data = await response.json();
    if (data.data?.accessToken && data.data?.refreshToken) {
      setTokens(data.data.accessToken, data.data.refreshToken);
      return data.data.accessToken;
    }

    return null;
  } catch {
    clearTokens();
    return null;
  }
};

/**
 * API client with automatic token refresh
 */
export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ClientResponse<T>> => {
  const makeRequest = async (token: string | null): Promise<Response> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  };

  try {
    const token = getAccessToken();
    let response = await makeRequest(token);

    // If unauthorized, try to refresh token
    if (response.status === 401 && token) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        response = await makeRequest(newToken);
      } else {
        // Redirect to login if refresh fails
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return { data: null, error: 'Session expired', success: false };
      }
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.message || 'An error occurred',
        success: false,
      };
    }

    return {
      data: data.data || data,
      error: null,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    return {
      data: null,
      error: errorMessage,
      success: false,
    };
  }
};

export default apiClient;
