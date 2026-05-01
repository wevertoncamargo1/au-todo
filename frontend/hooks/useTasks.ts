import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  CreateTaskInput,
  Task,
  TaskHistoryEvent,
  UpdateTaskDetailsInput,
  UpdateTaskStatusInput,
} from '@/types/task';

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get<Task[]>('/tasks');
      return data;
    },
    staleTime: 30_000,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const { data } = await api.post<Task>('/tasks', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, comment }: UpdateTaskStatusInput) => {
      const { data } = await api.patch<Task>(`/tasks/${id}/status`, { status, comment });
      return data;
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old ? old.map((t) => (t.id === id ? { ...t, status } : t)) : [],
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['tasks'], ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old ? old.filter((t) => t.id !== id) : [],
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['tasks'], ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTaskDetails() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title, description, priority, dueDate }: UpdateTaskDetailsInput) => {
      const { data } = await api.patch<Task>(`/tasks/${id}`, {
        title,
        description,
        priority,
        dueDate,
      });
      return data;
    },
    onMutate: async ({ id, title, description, priority, dueDate }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old
          ? old.map((t) =>
              t.id === id
                ? {
                    ...t,
                    title,
                    description,
                    priority,
                    dueDate,
                  }
                : t,
            )
          : [],
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['tasks'], ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useTaskHistory(taskId: string, enabled: boolean) {
  return useQuery<TaskHistoryEvent[]>({
    queryKey: ['task-history', taskId],
    queryFn: async () => {
      const { data } = await api.get<TaskHistoryEvent[]>(`/tasks/${taskId}/history`);
      return data;
    },
    enabled,
    staleTime: 10_000,
  });
}
