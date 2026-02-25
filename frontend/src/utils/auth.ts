// Store token in localStorage
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
    // Also set in a cookie for server-side access via middleware
    document.cookie = `access_token=${token}; path=/; SameSite=Lax`;
  }
};

// Get token from localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Get token from cookies (for server-side or when localStorage is not available)
export const getTokenFromCookie = (cookieHeader?: string): string | null => {
  if (typeof document !== 'undefined' && document.cookie) {
    // Client-side: get from document.cookie
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'access_token') {
        return value;
      }
    }
  } else if (cookieHeader) {
    // Server-side: parse from cookie header
    const cookies = cookieHeader.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'access_token') {
        return value;
      }
    }
  }
  return null;
};

// Remove token from localStorage and cookies
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    // Also remove from cookie
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

// Add auth headers to requests
export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? {
    Authorization: `Bearer ${token}`,
    'X-Access-Token': token  // Also send token in custom header for middleware
  } : {};
};