import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

export interface TaskRepository {
  save(task: Task): Promise<Task>;
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  updateStatus(id: string, status: TaskStatus, comment: string): Promise<Task>;
  delete(id: string): Promise<void>;
}

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');
