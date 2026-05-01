import { randomUUID } from 'crypto';
import { Task } from '../../../domain/task/task.entity';
import { Priority } from '../../../domain/task/priority.enum';
import { TaskStatus } from '../../../domain/task/task-status.enum';
import { PrismaTaskRepository } from './prisma-task.repository';
import { PrismaService } from './prisma.service';

describe('PrismaTaskRepository integration', () => {
  let prisma: PrismaService;
  let repository: PrismaTaskRepository;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    repository = new PrismaTaskRepository(prisma);
  });

  beforeEach(async () => {
    await prisma.taskFieldChange.deleteMany();
    await prisma.taskStatusChange.deleteMany();
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    await prisma.taskFieldChange.deleteMany();
    await prisma.taskStatusChange.deleteMany();
    await prisma.task.deleteMany();
    await prisma.$disconnect();
  });

  it('should persist and list tasks ordered by newest first', async () => {
    const olderTask = new Task(
      randomUUID(),
      'Primeira',
      'Descricao 1',
      TaskStatus.TODO,
      Priority.MEDIUM,
      new Date(Date.now() + 86_400_000),
      new Date(Date.now() - 10_000),
      new Date(Date.now() - 10_000),
    );
    const newerTask = new Task(
      randomUUID(),
      'Segunda',
      'Descricao 2',
      TaskStatus.REVIEW,
      Priority.HIGH,
      new Date(Date.now() + 172_800_000),
      new Date(),
      new Date(),
    );

    await repository.save(olderTask);
    await repository.save(newerTask);

    const tasks = await repository.findAll();

    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe('Segunda');
    expect(tasks[1].title).toBe('Primeira');
  });

  it('should update status and persist the reason in history', async () => {
    const task = new Task(
      randomUUID(),
      'Mover tarefa',
      'Descricao',
      TaskStatus.TODO,
      Priority.MEDIUM,
      new Date(Date.now() + 86_400_000),
      new Date(),
      new Date(),
    );

    await repository.save(task);
    const updated = await repository.updateStatus(task.id, TaskStatus.BLOCKED, 'Dependencia externa');
    const history = await prisma.taskStatusChange.findMany({ where: { taskId: task.id } });

    expect(updated.status).toBe(TaskStatus.BLOCKED);
    expect(history).toHaveLength(1);
    expect(history[0].fromStatus).toBe(TaskStatus.TODO);
    expect(history[0].toStatus).toBe(TaskStatus.BLOCKED);
    expect(history[0].comment).toBe('Dependencia externa');
  });
});
