import { NotFoundException } from '@nestjs/common';
import { Task } from '../../../domain/task/task.entity';
import { Priority } from '../../../domain/task/priority.enum';
import { TaskStatus } from '../../../domain/task/task-status.enum';
import { TaskRepository } from '../../../domain/task/task.repository';
import { DeleteTaskUseCase } from './delete-task.use-case';

const mockRepo: jest.Mocked<TaskRepository> = {
  save: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  updateStatus: jest.fn(),
  updateDetails: jest.fn(),
  listHistory: jest.fn(),
  delete: jest.fn(),
};

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteTaskUseCase(mockRepo);
  });

  it('should delete an existing task', async () => {
    const task = new Task('1', 'Task', null, TaskStatus.TODO, Priority.MEDIUM, null, new Date(), new Date());
    mockRepo.findById.mockResolvedValue(task);
    mockRepo.delete.mockResolvedValue(undefined);

    await useCase.execute('1');

    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException when task does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent')).rejects.toThrow(NotFoundException);
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });
});
