'use client';

import { Droppable } from '@hello-pangea/dnd';
import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';

interface Props {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

export function KanbanColumn({ id, title, color, tasks }: Props) {
  return (
    <div className="flex flex-col gap-3 min-w-[200px] xl:min-w-0 flex-1">
      <div className={`flex items-center gap-2 px-1`}>
        <span className={`h-3 w-3 rounded-full ${color}`} />
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {title}
        </h2>
        <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2 rounded-xl p-3 min-h-[200px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-violet-50 ring-2 ring-violet-200' : 'bg-gray-50'
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
