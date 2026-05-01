'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Task } from '@/types/task';

const COLORS: Record<string, string> = {
  TODO: '#9ca3af',
  IN_PROGRESS: '#fbbf24',
  DONE: '#34d399',
};

const LABELS: Record<string, string> = {
  TODO: 'A fazer',
  IN_PROGRESS: 'Em andamento',
  DONE: 'Concluído',
};

interface Props {
  tasks: Task[];
}

export function StatusChart({ tasks }: Props) {
  const data = ['TODO', 'IN_PROGRESS', 'DONE']
    .map((status) => ({
      name: LABELS[status],
      value: tasks.filter((t) => t.status === status).length,
      status,
    }))
    .filter((d) => d.value > 0);

  if (data.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-gray-700">Distribuição por status</h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.status} fill={COLORS[entry.status]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} tarefa(s)`, '']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
