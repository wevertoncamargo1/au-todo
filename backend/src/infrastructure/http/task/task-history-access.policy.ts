import { ForbiddenException, Injectable } from '@nestjs/common';

export interface TaskActor {
  id: string;
  roles: string[];
  permissions: string[];
}

@Injectable()
export class TaskHistoryAccessPolicy {
  // Placeholder policy. Wire user context/permissions here when auth is added.
  canViewHistory(_actor: TaskActor | null, _taskId: string): boolean {
    return true;
  }

  assertCanViewHistory(actor: TaskActor | null, taskId: string): void {
    if (!this.canViewHistory(actor, taskId)) {
      throw new ForbiddenException('Você não tem permissão para visualizar o histórico desta tarefa.');
    }
  }
}
