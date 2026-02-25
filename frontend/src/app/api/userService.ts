import { User } from '../../types/user';
import { getAuthHeaders } from '../../utils/auth';

/**
 * Service for user-related API operations
 */
export const userService = {
  /**
   * Fetch current user details
   * @returns Promise resolving to User object
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.statusText}`);
      }

      const userData = await response.json();

      // Transform the received data to match our User interface
      return {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch user details');
    }
  },

  /**
   * Update user profile
   * @param userData Updated user data
   * @returns Promise resolving to updated User object
   */
  updateUser: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update user');
    }
  },
};