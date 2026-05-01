import { NotFoundException } from '@nestjs/common';
import { Task } from '../../../domain/task/task.entity';
import { Priority } from '../../../domain/task/priority.enum';
import { TaskStatus } from '../../../domain/task/task-status.enum';
import { TaskRepository } from '../../../domain/task/task.repository';
import { UpdateTaskStatusUseCase } from './update-task-status.use-case';

const mockRepo: jest.Mocked<TaskRepository> = {
  save: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  updateStatus: jest.fn(),
  updateDetails: jest.fn(),
  listHistory: jest.fn(),
  delete: jest.fn(),
};

describe('UpdateTaskStatusUseCase', () => {
  let useCase: UpdateTaskStatusUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateTaskStatusUseCase(mockRepo);
  });

  it('should update task status', async () => {
    const task = new Task(
      '1',
      'Task',
      null,
      TaskStatus.TODO,
      Priority.MEDIUM,
      null,
      new Date(),
      new Date(),
    );
    const updated = new Task(
      '1',
      'Task',
      null,
      TaskStatus.DONE,
      Priority.MEDIUM,
      null,
      new Date(),
      new Date(),
    );
    mockRepo.findById.mockResolvedValue(task);
    mockRepo.updateStatus.mockResolvedValue(updated);

    const result = await useCase.execute('1', TaskStatus.DONE, 'Finalizado com sucesso');

    expect(result.status).toBe(TaskStatus.DONE);
    expect(mockRepo.updateStatus).toHaveBeenCalledWith('1', TaskStatus.DONE, 'Finalizado com sucesso');
  });

  it('should throw NotFoundException when task does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent', TaskStatus.DONE, 'Nao encontrado')).rejects.toThrow(
      NotFoundException,
    );
    expect(mockRepo.updateStatus).not.toHaveBeenCalled();
  });
});
