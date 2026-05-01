import { Task } from '../../../domain/task/task.entity';
import { Priority } from '../../../domain/task/priority.enum';
import { TaskStatus } from '../../../domain/task/task-status.enum';
import { TaskRepository } from '../../../domain/task/task.repository';
import { CreateTaskDto } from '../dtos/task.dto';
import { CreateTaskUseCase } from './create-task.use-case';

const mockRepo: jest.Mocked<TaskRepository> = {
  save: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  updateStatus: jest.fn(),
  updateDetails: jest.fn(),
  listHistory: jest.fn(),
  delete: jest.fn(),
};

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateTaskUseCase(mockRepo);
  });

  it('should create a task with TODO status by default', async () => {
    const dto: CreateTaskDto = {
      title: 'My task',
      description: 'My task details',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      dueDate: new Date().toISOString(),
    };
    const saved = new Task(
      'uuid',
      'My task',
      null,
      TaskStatus.TODO,
      Priority.MEDIUM,
      new Date(dto.dueDate),
      new Date(),
      new Date(),
    );
    mockRepo.save.mockResolvedValue(saved);

    const result = await useCase.execute(dto);

    expect(result.status).toBe(TaskStatus.TODO);
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
  });

  it('should create a task with custom status', async () => {
    const dto: CreateTaskDto = {
      title: 'In progress',
      description: 'In progress details',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      dueDate: new Date().toISOString(),
    };
    const saved = new Task(
      'uuid',
      'In progress',
      null,
      TaskStatus.IN_PROGRESS,
      Priority.HIGH,
      new Date(dto.dueDate),
      new Date(),
      new Date(),
    );
    mockRepo.save.mockResolvedValue(saved);

    const result = await useCase.execute(dto);

    expect(result.status).toBe(TaskStatus.IN_PROGRESS);
  });

  it('should pass title and description to repository', async () => {
    const dto: CreateTaskDto = {
      title: 'Task',
      description: 'Details',
      status: TaskStatus.TODO,
      priority: Priority.LOW,
      dueDate: new Date().toISOString(),
    };
    const saved = new Task(
      'uuid',
      'Task',
      'Details',
      TaskStatus.TODO,
      Priority.LOW,
      new Date(dto.dueDate),
      new Date(),
      new Date(),
    );
    mockRepo.save.mockResolvedValue(saved);

    await useCase.execute(dto);

    const taskArg = mockRepo.save.mock.calls[0][0];
    expect(taskArg.title).toBe('Task');
    expect(taskArg.description).toBe('Details');
  });
});
