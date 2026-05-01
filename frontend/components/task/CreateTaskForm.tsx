'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTask } from '@/hooks/useTasks';

const schema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100),
  description: z.string().min(1, 'Descrição é obrigatória').max(500),
  status: z.enum(['TODO', 'IN_PROGRESS', 'BLOCKED', 'REVIEW', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().min(1, 'Data limite é obrigatória'),
});

type FormData = z.infer<typeof schema>;

export function CreateTaskForm() {
  const { mutate, isPending } = useCreateTask();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  function onSubmit(data: FormData) {
    mutate(data, { onSuccess: () => reset() });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Título *</label>
        <input
          {...register('title')}
          placeholder="Digite o título da tarefa"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        />
        {errors.title && (
          <span className="text-xs text-red-500">{errors.title.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Descrição *</label>
        <textarea
          {...register('description')}
          placeholder="Descreva a tarefa"
          rows={3}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 resize-none"
        />
        {errors.description && (
          <span className="text-xs text-red-500">{errors.description.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Prioridade *</label>
        <select
          {...register('priority')}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 bg-white"
          defaultValue="MEDIUM"
        >
          <option value="LOW">Baixa</option>
          <option value="MEDIUM">Média</option>
          <option value="HIGH">Alta</option>
          <option value="URGENT">Urgente</option>
        </select>
        {errors.priority && (
          <span className="text-xs text-red-500">{errors.priority.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Data limite *</label>
        <input
          type="date"
          {...register('dueDate')}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        />
        {errors.dueDate && (
          <span className="text-xs text-red-500">{errors.dueDate.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Status inicial *</label>
        <select
          {...register('status')}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 bg-white"
        >
          <option value="TODO">A fazer</option>
          <option value="IN_PROGRESS">Em andamento</option>
          <option value="BLOCKED">Bloqueado</option>
          <option value="REVIEW">Review</option>
          <option value="DONE">Concluído</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 transition-colors"
      >
        {isPending ? 'Criando...' : 'Criar tarefa'}
      </button>
    </form>
  );
}
