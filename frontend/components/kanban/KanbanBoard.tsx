'use client';

import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useState } from 'react';
import { useUpdateTaskStatus } from '@/hooks/useTasks';
import { Task, TaskStatus } from '@/types/task';
import { KanbanColumn } from './KanbanColumn';

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'TODO', title: 'A fazer', color: 'bg-gray-400' },
  { id: 'IN_PROGRESS', title: 'Em andamento', color: 'bg-amber-400' },
  { id: 'BLOCKED', title: 'Bloqueado', color: 'bg-rose-400' },
  { id: 'REVIEW', title: 'Review', color: 'bg-cyan-400' },
  { id: 'DONE', title: 'Concluído', color: 'bg-emerald-400' },
];

const LABELS: Record<TaskStatus, string> = {
  TODO: 'A fazer',
  IN_PROGRESS: 'Em andamento',
  BLOCKED: 'Bloqueado',
  REVIEW: 'Review',
  DONE: 'Concluído',
};

interface Props {
  tasks: Task[];
}

export function KanbanBoard({ tasks }: Props) {
  const { mutate: updateStatus } = useUpdateTaskStatus();
  const [pendingMove, setPendingMove] = useState<{
    taskId: string;
    title: string;
    fromStatus: TaskStatus;
    toStatus: TaskStatus;
  } | null>(null);
  const [comment, setComment] = useState('');

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as TaskStatus;
    const taskId = result.draggableId;
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      setPendingMove({
        taskId,
        title: task.title,
        fromStatus: task.status,
        toStatus: newStatus,
      });
      setComment('');
    }
  }

  function cancelMove() {
    setPendingMove(null);
    setComment('');
  }

  function confirmMove() {
    if (!pendingMove || comment.trim().length < 3) return;

    updateStatus({
      id: pendingMove.taskId,
      status: pendingMove.toStatus,
      comment: comment.trim(),
    });

    cancelMove();
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              tasks={tasks.filter((t) => t.status === col.id)}
            />
          ))}
        </div>
      </DragDropContext>

      {pendingMove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900">Confirmar mudança de status</h3>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Tarefa:</span> {pendingMove.title}
              </p>
              <p>
                <span className="font-semibold">Mudança:</span> {LABELS[pendingMove.fromStatus]} -&gt;{' '}
                {LABELS[pendingMove.toStatus]}
              </p>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Comentário da mudança *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Explique o motivo desta mudança"
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />
              <p className="mt-1 text-xs text-gray-500">Mínimo de 3 caracteres.</p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={cancelMove}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmMove}
                disabled={comment.trim().length < 3}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar mudança
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
