import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  TASK_REPOSITORY,
  type TaskHistoryEvent,
  type TaskRepository,
} from '../../../domain/task/task.repository';

@Injectable()
export class ListTaskHistoryUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(id: string): Promise<TaskHistoryEvent[]> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return this.taskRepository.listHistory(id);
  }
}
