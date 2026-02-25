import { Task, TaskCreate, TaskUpdate } from '../../types/task';
import { getAuthHeaders, getToken } from '../../utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class TaskService {
  static async getAllTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/tasks`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in again');
      } else if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to access these tasks');
      } else {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }
    }

    return response.json();
  }

  static async getTaskById(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in again');
      } else if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to access this task');
      } else if (response.status === 404) {
        throw new Error('Task not found');
      } else {
        throw new Error(`Failed to fetch task: ${response.statusText}`);
      }
    }

    return response.json();
  }

  static async createTask(taskData: TaskCreate): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/v1/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in again');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to create task: ${response.statusText}`);
      }
    }

    return response.json();
  }

  static async updateTask(id: string, taskData: TaskUpdate): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in again');
      } else if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to update this task');
      } else if (response.status === 404) {
        throw new Error('Task not found');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to update task: ${response.statusText}`);
      }
    }

    return response.json();
  }

  static async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in again');
      } else if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to delete this task');
      } else if (response.status === 404) {
        throw new Error('Task not found');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to delete task: ${response.statusText}`);
      }
    }
  }
}

export default TaskService;