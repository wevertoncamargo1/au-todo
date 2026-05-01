import { IsDateString, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Priority } from '../../../domain/task/priority.enum';
import { TaskStatus } from '../../../domain/task/task-status.enum';

const SAFE_TEXT_REGEX = /^[\p{L}\p{N}\p{M}\p{P}\p{Zs}\n\r]+$/u;

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(SAFE_TEXT_REGEX, {
    message: 'Título contém caracteres inválidos. Use apenas texto, números e pontuação comum.',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Matches(SAFE_TEXT_REGEX, {
    message: 'Descrição contém caracteres inválidos. Use apenas texto, números e pontuação comum.',
  })
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
  @Matches(SAFE_TEXT_REGEX, {
    message: 'Comentário contém caracteres inválidos. Use apenas texto, números e pontuação comum.',
  })
  comment: string;
}

export class UpdateTaskDetailsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(SAFE_TEXT_REGEX, {
    message: 'Título contém caracteres inválidos. Use apenas texto, números e pontuação comum.',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Matches(SAFE_TEXT_REGEX, {
    message: 'Descrição contém caracteres inválidos. Use apenas texto, números e pontuação comum.',
  })
  description: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;
}
