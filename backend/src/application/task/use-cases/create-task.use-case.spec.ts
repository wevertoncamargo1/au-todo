import { NotFoundException } from '@nestjs/common';
import { Task } from '../../../domain/task/task.entity';
import { TaskStatus } from '../../../domain/task/task-status.enum';
import { TaskRepository } from '../../../domain/task/task.repository';
import { CreateTaskDto } from '../dtos/task.dto';
import { CreateTaskUseCase } from './create-task.use-case';

const mockRepo: jest.Mocked<TaskRepository> = {
  save: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  updateStatus: jest.fn(),
  delete: jest.fn(),
};

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateTaskUseCase(mockRepo);
  });

  it('should create a task with TODO status by default', async () => {
    const dto: CreateTaskDto = { title: 'My task' };
    const saved = new Task('uuid', 'My task', null, TaskStatus.TODO, new Date(), new Date());
    mockRepo.save.mockResolvedValue(saved);

    const result = await useCase.execute(dto);

    expect(result.status).toBe(TaskStatus.TODO);
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
  });

  it('should create a task with custom status', async () => {
    const dto: CreateTaskDto = { title: 'In progress', status: TaskStatus.IN_PROGRESS };
    const saved = new Task('uuid', 'In progress', null, TaskStatus.IN_PROGRESS, new Date(), new Date());
    mockRepo.save.mockResolvedValue(saved);

    const result = await useCase.execute(dto);

    expect(result.status).toBe(TaskStatus.IN_PROGRESS);
  });

  it('should pass title and description to repository', async () => {
    const dto: CreateTaskDto = { title: 'Task', description: 'Details' };
    const saved = new Task('uuid', 'Task', 'Details', TaskStatus.TODO, new Date(), new Date());
    mockRepo.save.mockResolvedValue(saved);

    await useCase.execute(dto);

    const taskArg = mockRepo.save.mock.calls[0][0];
    expect(taskArg.title).toBe('Task');
    expect(taskArg.description).toBe('Details');
  });
});
