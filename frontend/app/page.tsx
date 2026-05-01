'use client';

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { CreateTaskForm } from '@/components/task/CreateTaskForm';
import { StatusChart } from '@/components/ui/StatusChart';
import { useTasks } from '@/hooks/useTasks';
import { TaskStatus } from '@/types/task';

const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'A Fazer',
  IN_PROGRESS: 'Em Andamento',
  BLOCKED: 'Bloqueado',
  REVIEW: 'Review',
  DONE: 'Concluído',
};

const STATUS_BADGE: Record<TaskStatus, string> = {
  TODO: 'bg-slate-100 text-slate-600',
  IN_PROGRESS: 'bg-orange-100 text-orange-600',
  BLOCKED: 'bg-rose-100 text-rose-600',
  REVIEW: 'bg-cyan-100 text-cyan-600',
  DONE: 'bg-emerald-100 text-emerald-700',
};

const STATUS_BAR_FILL: Record<TaskStatus, string> = {
  TODO: '#94a3b8',
  IN_PROGRESS: '#f97316',
  BLOCKED: '#fb7185',
  REVIEW: '#22d3ee',
  DONE: '#22c55e',
};

function IconLayers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IconTrend() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
function IconCheckCircle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="8 12 11 15 16 9" />
    </svg>
  );
}

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

  const barData = (Object.keys(STATUS_LABELS) as TaskStatus[]).map((status) => ({
    name: STATUS_LABELS[status].split(' ')[0],
    value: countsByStatus[status],
    fill: STATUS_BAR_FILL[status],
    status,
  }));

  const navButtonClass = (value: Screen) =>
    `rounded-full px-5 py-2 text-sm font-medium transition-colors ${
      screen === value
        ? 'bg-gray-900 text-white'
        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900">
              <span className="text-xs font-bold text-white">AU</span>
            </div>
            <h1 className="text-base font-semibold text-gray-900">Task Flow Control</h1>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
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
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        {isLoading && (
          <div className="flex h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#171717] border-t-transparent" />
          </div>
        )}

        {isError && (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-red-500">Erro ao carregar tarefas. Verifique o backend.</p>
          </div>
        )}

        {!isLoading && !isError && screen === 'new-task' && (
          <section className="mx-auto max-w-2xl">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-6">
                <h2 className="text-lg font-semibold text-gray-900">Nova tarefa</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Preencha os campos para inserir a tarefa no fluxo do board.
                </p>
              </div>
              <div className="p-6">
                <CreateTaskForm />
              </div>
            </div>
          </section>
        )}

        {!isLoading && !isError && screen === 'board' && <KanbanBoard tasks={tasks} />}

        {!isLoading && !isError && screen === 'dashboard' && (
          <section className="space-y-5">
            {/* Metric cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                {
                  label: 'Total de Cards',
                  sublabel: 'No board',
                  value: totalCards,
                  iconBg: 'bg-indigo-50',
                  iconColor: 'text-indigo-400',
                  icon: <IconLayers />,
                },
                {
                  label: 'A Fazer',
                  sublabel: 'Aguardando início',
                  value: countsByStatus.TODO,
                  iconBg: 'bg-slate-50',
                  iconColor: 'text-slate-400',
                  icon: <IconClock />,
                },
                {
                  label: 'Em Andamento',
                  sublabel: 'Em progresso',
                  value: countsByStatus.IN_PROGRESS,
                  iconBg: 'bg-orange-50',
                  iconColor: 'text-orange-400',
                  icon: <IconTrend />,
                },
                {
                  label: 'Concluídos',
                  sublabel: `${doneRate}% do total`,
                  value: countsByStatus.DONE,
                  iconBg: 'bg-emerald-50',
                  iconColor: 'text-emerald-400',
                  icon: <IconCheckCircle />,
                },
              ].map((card) => (
                <div key={card.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}>
                    {card.icon}
                  </div>
                  <p className="mt-4 text-3xl font-bold text-gray-900">{card.value}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-700">{card.label}</p>
                  <p className="text-xs text-gray-400">{card.sublabel}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <StatusChart tasks={tasks} />
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700">Cards por Coluna</h3>
                <div className="mt-4 h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} barSize={36} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                      <CartesianGrid vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {barData.map((entry) => (
                          <Cell key={entry.status} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Completion progress */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-500">
                  <IconCheckCircle />
                  <span className="text-sm font-semibold text-gray-700">Taxa de Conclusão</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{doneRate}%</span>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{ width: `${doneRate}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>{countsByStatus.DONE} concluídos</span>
                <span>{totalCards} total</span>
              </div>
            </div>

            {/* Recent cards */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center justify-between px-5 py-4">
                <h3 className="text-sm font-semibold text-gray-900">Cards recentes</h3>
                <button
                  onClick={() => setScreen('board')}
                  className="text-sm font-medium text-orange-500 hover:text-orange-600"
                >
                  Ver todos →
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{task.title}</p>
                      {task.description && (
                        <p className="mt-0.5 truncate text-xs text-gray-400">{task.description}</p>
                      )}
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[task.status as TaskStatus]}`}>
                      {STATUS_LABELS[task.status as TaskStatus]}
                    </span>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="px-5 py-8 text-center text-sm text-gray-400">
                    Nenhuma tarefa cadastrada ainda.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
