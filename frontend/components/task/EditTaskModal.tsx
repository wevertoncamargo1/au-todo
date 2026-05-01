'use client';

import { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDeleteTask, useUpdateTaskDetails } from '@/hooks/useTasks';
import { Task } from '@/types/task';

const SAFE_TEXT_REGEX = /^[\p{L}\p{N}\p{M}\p{P}\p{Zs}\n\r]+$/u;

const schema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(100)
    .regex(SAFE_TEXT_REGEX, 'Título contém caracteres inválidos.'),
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(500)
    .regex(SAFE_TEXT_REGEX, 'Descrição contém caracteres inválidos.'),
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
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
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
        dueDate: data.dueDate,
      },
      { onSuccess: onClose },
    );
  }

  function onDelete() {
    deleteTask(task.id, { onSuccess: onClose });
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
              onClick={() => setConfirmDeleteOpen(true)}
              disabled={isDeleting || isPending}
              className="mr-auto inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              title="Excluir tarefa"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              Excluir
            </button>
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

        {confirmDeleteOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
              <h4 className="text-base font-semibold text-gray-900">Você tem certeza?</h4>
              <p className="mt-2 text-sm text-gray-600">
                Esta ação vai excluir a tarefa permanentemente e não pode ser desfeita.
              </p>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
