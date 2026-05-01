'use client';

import { Draggable } from '@hello-pangea/dnd';
import { useDeleteTask, useUpdateTaskStatus } from '@/hooks/useTasks';
import { Task, TaskStatus } from '@/types/task';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: 'A fazer' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'DONE', label: 'Concluído' },
];

interface Props {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: Props) {
  const { mutate: updateStatus } = useUpdateTaskStatus();
  const { mutate: deleteTask } = useDeleteTask();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`rounded-xl border bg-white p-3 shadow-sm flex flex-col gap-2 transition-shadow ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-violet-400' : 'hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-gray-800 leading-snug">{task.title}</p>
            <button
              onClick={() => deleteTask(task.id)}
              className="shrink-0 text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
              title="Excluir"
            >
              ×
            </button>
          </div>

          {task.description && (
            <p className="text-xs text-gray-500 leading-relaxed">{task.description}</p>
          )}

          <select
            value={task.status}
            onChange={(e) =>
              updateStatus({ id: task.id, status: e.target.value as TaskStatus })
            }
            className="mt-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600 outline-none focus:border-violet-400"
            onClick={(e) => e.stopPropagation()}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </Draggable>
  );
}
