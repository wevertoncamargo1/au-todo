import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Task } from '../../../domain/task/task.entity';
import { TASK_REPOSITORY, type TaskRepository } from '../../../domain/task/task.repository';
import { CreateTaskDto } from '../dtos/task.dto';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(dto: CreateTaskDto): Promise<Task> {
    const task = new Task(
      randomUUID(),
      dto.title,
      dto.description,
      dto.status,
      dto.priority,
      new Date(dto.dueDate),
      new Date(),
      new Date(),
    );
    return this.taskRepository.save(task);
  }
}
