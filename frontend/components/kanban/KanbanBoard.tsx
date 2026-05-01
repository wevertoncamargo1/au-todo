'use client';

import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useUpdateTaskStatus } from '@/hooks/useTasks';
import { Task, TaskStatus } from '@/types/task';
import { KanbanColumn } from './KanbanColumn';

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'TODO', title: 'A fazer', color: 'bg-gray-400' },
  { id: 'IN_PROGRESS', title: 'Em andamento', color: 'bg-amber-400' },
  { id: 'DONE', title: 'Concluído', color: 'bg-emerald-400' },
];

interface Props {
  tasks: Task[];
}

export function KanbanBoard({ tasks }: Props) {
  const { mutate: updateStatus } = useUpdateTaskStatus();

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as TaskStatus;
    const taskId = result.draggableId;
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      updateStatus({ id: taskId, status: newStatus });
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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
  );
}
