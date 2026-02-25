export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'completed';
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
}