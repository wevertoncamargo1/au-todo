import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../../../domain/task/task.entity';
import { TASK_REPOSITORY, type TaskRepository } from '../../../domain/task/task.repository';
import { TaskStatus } from '../../../domain/task/task-status.enum';

@Injectable()
export class UpdateTaskStatusUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(id: string, status: TaskStatus, comment: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    return this.taskRepository.updateStatus(id, status, comment);
  }
}
