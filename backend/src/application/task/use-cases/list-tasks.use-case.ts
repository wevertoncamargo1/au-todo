import { Inject, Injectable } from '@nestjs/common';
import { Task } from '../../../domain/task/task.entity';
import { TASK_REPOSITORY, type TaskRepository } from '../../../domain/task/task.repository';

@Injectable()
export class ListTasksUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }
}
