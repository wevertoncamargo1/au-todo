import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTaskUseCase } from '../../../application/task/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '../../../application/task/use-cases/delete-task.use-case';
import { ListTasksUseCase } from '../../../application/task/use-cases/list-tasks.use-case';
import { UpdateTaskStatusUseCase } from '../../../application/task/use-cases/update-task-status.use-case';
import { CreateTaskDto, UpdateTaskStatusDto } from '../../../application/task/dtos/task.dto';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly createTask: CreateTaskUseCase,
    private readonly listTasks: ListTasksUseCase,
    private readonly updateTaskStatus: UpdateTaskStatusUseCase,
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
    return this.updateTaskStatus.execute(id, dto.status);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.deleteTask.execute(id);
  }
}
