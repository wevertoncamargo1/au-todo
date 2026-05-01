'use client';

import { useState } from 'react';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { CreateTaskForm } from '@/components/task/CreateTaskForm';
import { StatusChart } from '@/components/ui/StatusChart';
import { useTasks } from '@/hooks/useTasks';

export default function Home() {
  const { data: tasks = [], isLoading, isError } = useTasks();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">AU</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Gerenciador de Tarefas</h1>
        </div>
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
        >
          {sidebarOpen ? '✕ Fechar' : '+ Nova tarefa'}
        </button>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-gray-200 flex flex-col gap-6 overflow-y-auto shrink-0 transition-all duration-200 ${
            sidebarOpen ? 'w-72 p-5' : 'w-0 overflow-hidden'
          }`}
        >
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-4">Nova tarefa</h2>
            <CreateTaskForm />
          </div>
          <StatusChart tasks={tasks} />
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto p-6">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
            </div>
          )}

          {isError && (
            <div className="flex h-full items-center justify-center">
              <p className="text-red-500 text-sm">
                Erro ao carregar tarefas. Verifique se o backend está rodando.
              </p>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <div className="mb-5">
                <p className="text-sm text-gray-500">
                  {tasks.length === 0
                    ? 'Nenhuma tarefa ainda. Clique em "+ Nova tarefa" para começar!'
                    : `${tasks.length} tarefa(s) no total`}
                </p>
              </div>
              <KanbanBoard tasks={tasks} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
