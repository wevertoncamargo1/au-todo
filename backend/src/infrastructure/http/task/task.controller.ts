import {
  Req,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type { Request } from 'express';
import { CreateTaskUseCase } from '../../../application/task/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '../../../application/task/use-cases/delete-task.use-case';
import { ListTaskHistoryUseCase } from '../../../application/task/use-cases/list-task-history.use-case';
import { ListTasksUseCase } from '../../../application/task/use-cases/list-tasks.use-case';
import { UpdateTaskDetailsUseCase } from '../../../application/task/use-cases/update-task-details.use-case';
import { UpdateTaskStatusUseCase } from '../../../application/task/use-cases/update-task-status.use-case';
import {
  CreateTaskDto,
  UpdateTaskDetailsDto,
  UpdateTaskStatusDto,
} from '../../../application/task/dtos/task.dto';
import { TaskHistoryAccessPolicy, TaskActor } from './task-history-access.policy';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly createTask: CreateTaskUseCase,
    private readonly listTasks: ListTasksUseCase,
    private readonly updateTaskStatus: UpdateTaskStatusUseCase,
    private readonly updateTaskDetails: UpdateTaskDetailsUseCase,
    private readonly listTaskHistory: ListTaskHistoryUseCase,
    private readonly historyAccessPolicy: TaskHistoryAccessPolicy,
    private readonly deleteTask: DeleteTaskUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.createTask.execute(dto);
  }

  @Get()
  findAll() {
    return this.listTasks.execute();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTaskStatusDto) {
    return this.updateTaskStatus.execute(id, dto.status, dto.comment);
  }

  @Patch(':id')
  updateDetails(@Param('id') id: string, @Body() dto: UpdateTaskDetailsDto) {
    return this.updateTaskDetails.execute(id, {
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      dueDate: new Date(dto.dueDate),
    });
  }

  @Get(':id/history')
  history(@Param('id') id: string, @Req() req: Request) {
    const actor = (req as Request & { user?: TaskActor }).user ?? null;
    this.historyAccessPolicy.assertCanViewHistory(actor, id);
    return this.listTaskHistory.execute(id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.deleteTask.execute(id);
  }
}
