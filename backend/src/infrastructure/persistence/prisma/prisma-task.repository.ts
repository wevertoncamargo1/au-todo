import { Injectable } from '@nestjs/common';
import { Task } from '../../../domain/task/task.entity';
import { type TaskRepository } from '../../../domain/task/task.repository';
import { TaskStatus } from '../../../domain/task/task-status.enum';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(record: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): Task {
    return new Task(
      record.id,
      record.title,
      record.description,
      record.status as TaskStatus,
      record.createdAt,
      record.updatedAt,
    );
  }

  async save(task: Task): Promise<Task> {
    const record = await this.prisma.task.create({
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
      },
    });
    return this.toDomain(record);
  }

  async findAll(): Promise<Task[]> {
    const records = await this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Task | null> {
    const record = await this.prisma.task.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async updateStatus(id: string, status: TaskStatus, comment: string): Promise<Task> {
    const record = await this.prisma.$transaction(async (tx) => {
      const current = await tx.task.findUniqueOrThrow({ where: { id } });

      const updated = await tx.task.update({
        where: { id },
        data: { status },
      });

      await tx.taskStatusChange.create({
        data: {
          taskId: id,
          fromStatus: current.status as TaskStatus,
          toStatus: status,
          comment,
        },
      });

      return updated;
    });

    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }
}
