export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'REVIEW' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TaskHistoryType = 'STATUS' | 'FIELD';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
}

export interface UpdateTaskStatusInput {
  id: string;
  status: TaskStatus;
  comment: string;
}

export interface UpdateTaskDetailsInput {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}

export interface TaskHistoryEvent {
  id: string;
  type: TaskHistoryType;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  comment: string | null;
  createdAt: string;
}
