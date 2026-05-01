'use client';

import { useTaskHistory } from '@/hooks/useTasks';

interface Props {
  taskId: string;
  onClose: () => void;
}

const FIELD_LABELS: Record<string, string> = {
  title: 'Título',
  description: 'Descrição',
  priority: 'Prioridade',
  dueDate: 'Data limite',
  status: 'Status',
};

export function TaskHistoryModal({ taskId, onClose }: Props) {
  const { data = [], isLoading } = useTaskHistory(taskId, true);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Histórico da tarefa</h3>
            <p className="text-sm text-gray-500">Alterações em ordem cronológica recente.</p>
          </div>
          <button onClick={onClose} className="text-2xl leading-none text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-2 pr-1">
          {isLoading && <p className="text-sm text-gray-500">Carregando histórico...</p>}

          {!isLoading && data.length === 0 && (
            <p className="text-sm text-gray-500">Nenhum evento registrado para esta tarefa.</p>
          )}

          {data.map((event) => (
            <div key={event.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-800">
                  {event.type === 'STATUS' ? 'Mudança de status' : 'Alteração de campo'}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(event.createdAt).toLocaleString('pt-BR')}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-700">
                <span className="font-medium">Campo:</span> {FIELD_LABELS[event.field] ?? event.field}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                <span className="font-medium">De:</span> {event.oldValue ?? '-'}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                <span className="font-medium">Para:</span> {event.newValue ?? '-'}
              </p>
              {event.comment && (
                <p className="mt-1 text-sm text-gray-700">
                  <span className="font-medium">Comentário:</span> {event.comment}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
