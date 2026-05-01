import { IsDateString, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Priority } from '../../../domain/task/priority.enum';
import { TaskStatus } from '../../../domain/task/task-status.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsEnum(Priority)
  priority: Priority;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;
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

export class UpdateTaskDetailsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;
}
