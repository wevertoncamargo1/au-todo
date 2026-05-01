'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTask } from '@/hooks/useTasks';

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
  status: z.enum(['TODO', 'IN_PROGRESS', 'BLOCKED', 'REVIEW', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().min(1, 'Data limite é obrigatória'),
});

type FormData = z.infer<typeof schema>;

type Feedback = {
  type: 'success' | 'error';
  message: string;
};

export function CreateTaskForm() {
  const { mutate, isPending } = useCreateTask();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 2600);
    return () => clearTimeout(timer);
  }, [feedback]);

  function onSubmit(data: FormData) {
    mutate(data, {
      onSuccess: () => {
        reset();
        setFeedback({ type: 'success', message: 'Ticket criado com sucesso.' });
      },
      onError: () => {
        setFeedback({ type: 'error', message: 'Falha ao criar ticket. Tente novamente.' });
      },
    });
  }

  return (
    <>
      {feedback && (
        <div
          className={`fixed bottom-4 left-4 z-[80] rounded-lg border px-3 py-2 text-sm shadow-lg transition-opacity ${
            feedback.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

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
    </>
  );
}
