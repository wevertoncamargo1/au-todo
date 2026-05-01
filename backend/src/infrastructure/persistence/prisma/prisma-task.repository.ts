import { Injectable } from '@nestjs/common';
import { Priority } from '../../../domain/task/priority.enum';
import { Task } from '../../../domain/task/task.entity';
import {
  type TaskHistoryEvent,
  type TaskRepository,
  type UpdateTaskDetailsInput,
} from '../../../domain/task/task.repository';
import { TaskStatus } from '../../../domain/task/task-status.enum';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDateOnlyValue(date: Date | null): string | null {
    return date ? date.toISOString().slice(0, 10) : null;
  }

  private toDomain(record: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Task {
    return new Task(
      record.id,
      record.title,
      record.description,
      record.status as TaskStatus,
      record.priority as Priority,
      record.dueDate,
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
        priority: task.priority,
        dueDate: task.dueDate,
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

  async updateDetails(id: string, input: UpdateTaskDetailsInput): Promise<Task> {
    const record = await this.prisma.$transaction(async (tx) => {
      const current = await tx.task.findUniqueOrThrow({ where: { id } });

      const updated = await tx.task.update({
        where: { id },
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          dueDate: input.dueDate,
        },
      });

      const changes: { field: string; oldValue: string | null; newValue: string | null }[] = [];

      if (current.title !== input.title) {
        changes.push({ field: 'title', oldValue: current.title, newValue: input.title });
      }
      if ((current.description ?? '') !== input.description) {
        changes.push({
          field: 'description',
          oldValue: current.description,
          newValue: input.description,
        });
      }
      if ((current.priority as Priority) !== input.priority) {
        changes.push({
          field: 'priority',
          oldValue: current.priority,
          newValue: input.priority,
        });
      }
      const oldDueDate = this.toDateOnlyValue(current.dueDate);
      const newDueDate = this.toDateOnlyValue(input.dueDate);

      if (oldDueDate !== newDueDate) {
        changes.push({
          field: 'dueDate',
          oldValue: oldDueDate,
          newValue: newDueDate,
        });
      }

      if (changes.length > 0) {
        await tx.taskFieldChange.createMany({
          data: changes.map((change) => ({
            taskId: id,
            field: change.field,
            oldValue: change.oldValue,
            newValue: change.newValue,
          })),
        });
      }

      return updated;
    });

    return this.toDomain(record);
  }

  async listHistory(id: string): Promise<TaskHistoryEvent[]> {
    const [statusChanges, fieldChanges] = await Promise.all([
      this.prisma.taskStatusChange.findMany({
        where: { taskId: id },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.taskFieldChange.findMany({
        where: { taskId: id },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return [
      ...statusChanges.map((s) => ({
        id: s.id,
        type: 'STATUS' as const,
        field: 'status',
        oldValue: s.fromStatus,
        newValue: s.toStatus,
        comment: s.comment,
        createdAt: s.createdAt,
      })),
      ...fieldChanges.map((f) => ({
        id: f.id,
        type: 'FIELD' as const,
        field: f.field,
        oldValue: f.oldValue,
        newValue: f.newValue,
        comment: null,
        createdAt: f.createdAt,
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }
}
