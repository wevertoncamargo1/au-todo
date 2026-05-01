import { TaskStatus } from './task-status.enum';
import { Priority } from './priority.enum';

export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string | null,
    public status: TaskStatus,
    public priority: Priority,
    public dueDate: Date | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
