'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateTaskDetails } from '@/hooks/useTasks';
import { Task } from '@/types/task';

const schema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100),
  description: z.string().min(1, 'Descrição é obrigatória').max(500),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().min(1, 'Data limite é obrigatória'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  task: Task;
  canOpenHistory: boolean;
  onClose: () => void;
  onOpenHistory: () => void;
}

export function EditTaskModal({ task, canOpenHistory, onClose, onOpenHistory }: Props) {
  const { mutate, isPending } = useUpdateTaskDetails();
  const defaultDate = useMemo(() => task.dueDate?.slice(0, 10) ?? '', [task.dueDate]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      dueDate: defaultDate,
    },
  });

  useEffect(() => {
    reset({
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      dueDate: task.dueDate?.slice(0, 10) ?? '',
    });
  }, [task, reset]);

  function onSubmit(data: FormData) {
    mutate(
      {
        id: task.id,
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: new Date(data.dueDate).toISOString(),
      },
      { onSuccess: onClose },
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Editar tarefa</h3>
            <p className="text-sm text-gray-500">Atualize título, descrição, prioridade e prazo.</p>
          </div>
          <button onClick={onClose} className="text-2xl leading-none text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Título *</label>
            <input
              {...register('title')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Descrição *</label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Prioridade *</label>
              <select
                {...register('priority')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Data limite *</label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />
              {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate.message}</p>}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onOpenHistory}
              disabled={!canOpenHistory}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Histórico
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {isPending ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
