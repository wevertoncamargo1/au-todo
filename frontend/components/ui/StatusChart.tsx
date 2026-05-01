'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Task } from '@/types/task';

const COLORS: Record<string, string> = {
  TODO: '#94a3b8',
  IN_PROGRESS: '#f97316',
  BLOCKED: '#fb7185',
  REVIEW: '#22d3ee',
  DONE: '#22c55e',
};

const LABELS: Record<string, string> = {
  TODO: 'A Fazer',
  IN_PROGRESS: 'Em Andamento',
  BLOCKED: 'Bloqueado',
  REVIEW: 'Review',
  DONE: 'Concluído',
};

interface Props {
  tasks: Task[];
}

export function StatusChart({ tasks }: Props) {
  const total = tasks.length;
  const data = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'REVIEW', 'DONE']
    .map((status) => ({
      name: LABELS[status],
      value: tasks.filter((t) => t.status === status).length,
      status,
      fill: COLORS[status],
    }))
    .filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700">Distribuição por Status</h3>
        <p className="mt-6 text-sm text-gray-400">Nenhum dado disponível ainda.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700">Distribuição por Status</h3>
      <div className="mt-4 flex items-center gap-4">
        <div className="h-[190px] w-[190px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={88}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          {data.map((entry) => {
            const pct = Math.round((entry.value / total) * 100);
            return (
              <div key={entry.status} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.fill }} />
                  <span className="text-sm text-gray-700">{entry.name}</span>
                </div>
                <div className="flex items-center gap-2 tabular-nums">
                  <span className="text-sm font-semibold text-gray-900">{entry.value}</span>
                  <span className="w-8 text-right text-xs text-gray-400">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
