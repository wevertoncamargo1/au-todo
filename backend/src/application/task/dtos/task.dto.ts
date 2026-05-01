import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { TaskStatus } from '../../../domain/task/task-status.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  comment: string;
}
