'use client';

import { Draggable } from '@hello-pangea/dnd';
import { useDeleteTask } from '@/hooks/useTasks';
import { Priority, Task } from '@/types/task';

interface Props {
  task: Task;
  index: number;
  onOpenTask: (task: Task) => void;
}

const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};

function formatDateOnly(value: string | null): string {
  if (!value) return '-';
  const dateOnly = value.slice(0, 10);
  const [year, month, day] = dateOnly.split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export function TaskCard({ task, index, onOpenTask }: Props) {
  const { mutate: deleteTask } = useDeleteTask();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onOpenTask(task)}
          className={`rounded-xl border bg-white p-3 shadow-sm flex flex-col gap-2 transition-shadow ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-violet-400' : 'hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-gray-800 leading-snug">{task.title}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}
              className="shrink-0 text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
              title="Excluir"
            >
              ×
            </button>
          </div>

          {task.description && (
            <p className="text-xs text-gray-500 leading-relaxed">{task.description}</p>
          )}

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700">
              {PRIORITY_LABELS[task.priority]}
            </span>
            <span>
              Prazo: {formatDateOnly(task.dueDate)}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
