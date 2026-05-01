import { Task } from './task.entity';
import { Priority } from './priority.enum';
import { TaskStatus } from './task-status.enum';

export interface UpdateTaskDetailsInput {
  title: string;
  description: string;
  priority: Priority;
  dueDate: Date;
}

export interface TaskHistoryEvent {
  id: string;
  type: 'STATUS' | 'FIELD';
  field: string;
  oldValue: string | null;
  newValue: string | null;
  comment: string | null;
  createdAt: Date;
}

export interface TaskRepository {
  save(task: Task): Promise<Task>;
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  updateStatus(id: string, status: TaskStatus, comment: string): Promise<Task>;
  updateDetails(id: string, input: UpdateTaskDetailsInput): Promise<Task>;
  listHistory(id: string): Promise<TaskHistoryEvent[]>;
  delete(id: string): Promise<void>;
}

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');
