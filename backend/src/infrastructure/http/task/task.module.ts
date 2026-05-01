import { Module } from '@nestjs/common';
import { CreateTaskUseCase } from '../../../application/task/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '../../../application/task/use-cases/delete-task.use-case';
import { ListTaskHistoryUseCase } from '../../../application/task/use-cases/list-task-history.use-case';
import { ListTasksUseCase } from '../../../application/task/use-cases/list-tasks.use-case';
import { UpdateTaskDetailsUseCase } from '../../../application/task/use-cases/update-task-details.use-case';
import { UpdateTaskStatusUseCase } from '../../../application/task/use-cases/update-task-status.use-case';
import { TASK_REPOSITORY } from '../../../domain/task/task.repository';
import { PrismaTaskRepository } from '../../persistence/prisma/prisma-task.repository';
import { PrismaService } from '../../persistence/prisma/prisma.service';
import { TaskHistoryAccessPolicy } from './task-history-access.policy';
import { TaskController } from './task.controller';

@Module({
  controllers: [TaskController],
  providers: [
    PrismaService,
    TaskHistoryAccessPolicy,
    { provide: TASK_REPOSITORY, useClass: PrismaTaskRepository },
    CreateTaskUseCase,
    ListTasksUseCase,
    UpdateTaskStatusUseCase,
    UpdateTaskDetailsUseCase,
    ListTaskHistoryUseCase,
    DeleteTaskUseCase,
  ],
})
export class TaskModule {}
