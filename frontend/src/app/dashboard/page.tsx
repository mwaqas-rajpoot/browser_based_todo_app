'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Task, TaskCreate, TaskUpdate } from '../../types/task';
import { getAuthHeaders, isAuthenticated, removeToken } from '../../utils/auth';
import { useRouter } from 'next/navigation';
import { User } from '../../types/user';
import { userService } from '../api/userService';
import ThemeToggle from '../components/ThemeToggle';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<TaskCreate>({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState<TaskUpdate>({});
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    sortBy: 'created_at',
    sortOrder: 'asc'
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  // New useEffect for initial authentication check and redirect
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  // Memoize fetchTasks to make it stable across renders and prevent useEffect loops
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks?${queryParams}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // If the error is related to authentication (e.g., token expired), redirect to login
        if (response.status === 401) { // Explicitly check for 401
          removeToken(); // Clear invalid token
          router.push('/login');
          return; // Prevent further execution
        }
        throw new Error(errorData.detail || `Failed to fetch tasks: ${response.statusText}`);
      }

      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filters, router]); // filters are a dependency for queryParams, router for push

  // This useEffect will now solely handle fetching user data and tasks once authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated()) { // Only fetch data if authenticated
        try {
          setUserLoading(true);
          const user = await userService.getCurrentUser();
          setCurrentUser(user);
        } catch (err) {
          if (err instanceof Error &&
              (err.message.includes('401') ||
               err.message.includes('Unauthorized') ||
               err.message.includes('Failed to fetch user details'))) {
            removeToken();
            router.push('/login');
          } else {
            setError(err instanceof Error ? err.message : 'Failed to load user data');
          }
        } finally {
          setUserLoading(false);
        }
      }
    };

    fetchUserData();
    if (isAuthenticated()) { // Ensure tasks are fetched only if authenticated after user data
        fetchTasks();
    }
  }, [fetchTasks, router]);


  const handleSubmitNewTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create task');
      }

      const createdTask: Task = await response.json();
      setTasks([...tasks, createdTask]);
      setNewTask({ title: '', description: '' });
    } catch (err) {
      console.error('Task creation error:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Network error: Could not connect to the server. Make sure the backend is running at ' + process.env.NEXT_PUBLIC_API_URL);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create task');
      }
    }
  };

  const handleEditTask = async (taskId: string) => {
    if (!editingTask || !editForm) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update task');
      }

      const updatedTask: Task = await response.json();
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      setEditingTask(null);
      setEditForm({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete task');
      }

      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const handleLogout = () => {
    removeToken(); // Use the utility function
    router.push('/'); // Redirect to home page after logout
  };

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If we reach here and not authenticated, means the initial redirect took place.
  // We can add an extra check here just in case, though the useEffect should handle it.
  if (!isAuthenticated()) {
      return null; // Or a very minimal loading/redirecting message
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Todo Dashboard</h1>
              <Link href="/" className="ml-4 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                Home
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser && !userLoading && (
                <div className="flex flex-col items-end mr-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{currentUser.username}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</span>
                </div>
              )}
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
              {error}
            </div>
          )}

          {/* Filter Controls */}
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Filter Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  id="filter-status"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label htmlFor="filter-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  id="filter-priority"
                  value={filters.priority}
                  onChange={(e) => setFilters({...filters, priority: e.target.value})}
                  className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  id="sort-by"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="created_at">Created Date</option>
                  <option value="updated_at">Updated Date</option>
                  <option value="due_date">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="status">Status</option>
                </select>
              </div>
              <div>
                <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order
                </label>
                <select
                  id="sort-order"
                  value={filters.sortOrder}
                  onChange={(e) => setFilters({...filters, sortOrder: e.target.value})}
                  className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Task Creation Form */}
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Create New Task</h2>
            <form onSubmit={handleSubmitNewTask} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newTask.description || ''}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={newTask.priority || 'medium'}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    value={newTask.due_date || ''}
                    onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Create Task
              </button>
            </form>
          </div>

          {/* Task List */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Your Tasks ({tasks.length})</h2>

            {tasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No tasks yet. Create your first task above!</p>
            ) : (
              <div className="overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {tasks.map((task) => (
                    <li key={task.id} className="py-4">
                      {editingTask?.id === task.id ? (
                        // Edit form for this task
                        <div className="border border-blue-200 dark:border-blue-700 rounded p-4 bg-blue-50 dark:bg-blue-900">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Editing: {task.title}</h3>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleEditTask(task.id);
                            }}
                            className="space-y-2"
                          >
                            <div>
                              <input
                                type="text"
                                value={editForm.title ?? task.title}
                                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                className="block w-full p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              />
                            </div>
                            <div>
                              <textarea
                                value={editForm.description ?? task.description ?? ''}
                                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                className="block w-full p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <select
                                value={editForm.status ?? task.status}
                                onChange={(e) => setEditForm({...editForm, status: e.target.value as 'todo' | 'in_progress' | 'completed'})}
                                className="p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              >
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>
                              <select
                                value={editForm.priority ?? task.priority}
                                onChange={(e) => setEditForm({...editForm, priority: e.target.value as 'low' | 'medium' | 'high'})}
                                className="p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                              <input
                                type="date"
                                value={editForm.due_date?.split('T')[0] ?? (task.due_date ? task.due_date.split('T')[0] : '')}
                                onChange={(e) => setEditForm({...editForm, due_date: e.target.value})}
                                className="p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              />
                            </div>
                            <div className="flex space-x-2 mt-2">
                              <button
                                type="submit"
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingTask(null);
                                  setEditForm({});
                                }}
                                className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        // Display task details
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline">
                              <h3 className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                {task.title}
                              </h3>
                              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                task.status === 'todo' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                task.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              }`}>
                                {task.status.replace('_', ' ')}
                              </span>
                              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                task.priority === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                            {task.description && (
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                            )}
                            {task.due_date && (
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Due: {new Date(task.due_date).toLocaleDateString()}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                              Created: {new Date(task.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => {
                                setEditingTask(task);
                                setEditForm({
                                  title: task.title,
                                  description: task.description,
                                  status: task.status,
                                  priority: task.priority,
                                  due_date: task.due_date,
                                });
                              }}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}