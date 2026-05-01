import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../../../domain/task/task.entity';
import {
  TASK_REPOSITORY,
  type TaskRepository,
  type UpdateTaskDetailsInput,
} from '../../../domain/task/task.repository';

@Injectable()
export class UpdateTaskDetailsUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(id: string, input: UpdateTaskDetailsInput): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return this.taskRepository.updateDetails(id, input);
  }
}
