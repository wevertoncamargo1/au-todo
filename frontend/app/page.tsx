'use client';

import { useState } from 'react';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { CreateTaskForm } from '@/components/task/CreateTaskForm';
import { StatusChart } from '@/components/ui/StatusChart';
import { useTasks } from '@/hooks/useTasks';
import { TaskStatus } from '@/types/task';

const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'A fazer',
  IN_PROGRESS: 'Em andamento',
  BLOCKED: 'Bloqueado',
  REVIEW: 'Review',
  DONE: 'Concluído',
};

type Screen = 'new-task' | 'board' | 'dashboard';

export default function Home() {
  const { data: tasks = [], isLoading, isError } = useTasks();
  const [screen, setScreen] = useState<Screen>('board');

  const countsByStatus: Record<TaskStatus, number> = {
    TODO: tasks.filter((t) => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    BLOCKED: tasks.filter((t) => t.status === 'BLOCKED').length,
    REVIEW: tasks.filter((t) => t.status === 'REVIEW').length,
    DONE: tasks.filter((t) => t.status === 'DONE').length,
  };

  const totalCards = tasks.length;
  const doneRate = totalCards > 0 ? Math.round((countsByStatus.DONE / totalCards) * 100) : 0;

  const navButtonClass = (value: Screen) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      screen === value
        ? 'bg-violet-600 text-white'
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">AU</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Gerenciador de Tarefas</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setScreen('new-task')} className={navButtonClass('new-task')}>
            + Nova tarefa
          </button>
          <button onClick={() => setScreen('board')} className={navButtonClass('board')}>
            Board
          </button>
          <button onClick={() => setScreen('dashboard')} className={navButtonClass('dashboard')}>
            Dashboard
          </button>
        </div>
      </header>

      <main className="p-6">
        {isLoading && (
          <div className="flex h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
          </div>
        )}

        {isError && (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-red-500 text-sm">Erro ao carregar tarefas. Verifique o backend.</p>
          </div>
        )}

        {!isLoading && !isError && screen === 'new-task' && (
          <section className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Nova tarefa</h2>
            <p className="mt-1 text-sm text-gray-500">Preencha todos os campos obrigatórios.</p>
            <div className="mt-6">
              <CreateTaskForm />
            </div>
          </section>
        )}

        {!isLoading && !isError && screen === 'board' && (
          <section>
            <div className="mb-5 text-sm text-gray-500">
              {tasks.length === 0
                ? 'Nenhuma tarefa ainda. Vá em "+ Nova tarefa" para criar a primeira.'
                : `${tasks.length} tarefa(s) no total`}
            </div>
            <KanbanBoard tasks={tasks} />
          </section>
        )}

        {!isLoading && !isError && screen === 'dashboard' && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Total de cards</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{totalCards}</p>
              </div>
              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Concluídos</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">{countsByStatus.DONE}</p>
              </div>
              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Taxa de concluídos</p>
                <p className="mt-2 text-3xl font-bold text-violet-600">{doneRate}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
              {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((status) => (
                <div key={status} className="rounded-2xl border bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">{STATUS_LABELS[status]}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{countsByStatus[status]}</p>
                </div>
              ))}
            </div>

            <StatusChart tasks={tasks} />

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700">Resumo em linha</h3>
              <p className="mt-2 text-sm text-gray-600">
                Total: <span className="font-semibold">{totalCards}</span> | A fazer:{' '}
                <span className="font-semibold">{countsByStatus.TODO}</span> | Em andamento:{' '}
                <span className="font-semibold">{countsByStatus.IN_PROGRESS}</span> | Bloqueado:{' '}
                <span className="font-semibold">{countsByStatus.BLOCKED}</span> | Review:{' '}
                <span className="font-semibold">{countsByStatus.REVIEW}</span> | Concluído:{' '}
                <span className="font-semibold">{countsByStatus.DONE}</span>
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
