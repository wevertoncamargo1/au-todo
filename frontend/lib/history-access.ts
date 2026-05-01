export interface TaskHistoryViewer {
  id: string;
  roles: string[];
  permissions: string[];
}

export interface HistoryAccessPolicy {
  canViewTaskHistory(input: { viewer: TaskHistoryViewer | null; taskId: string }): boolean;
}

const defaultHistoryAccessPolicy: HistoryAccessPolicy = {
  // Placeholder policy. Wire auth/permissions here when user system is added.
  canViewTaskHistory: () => true,
};

export function createHistoryAccess(policy: HistoryAccessPolicy = defaultHistoryAccessPolicy) {
  return {
    canViewTaskHistory: (input: { viewer: TaskHistoryViewer | null; taskId: string }) =>
      policy.canViewTaskHistory(input),
  };
}

export const historyAccess = createHistoryAccess();
