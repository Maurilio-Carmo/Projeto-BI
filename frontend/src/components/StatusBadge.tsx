// frontend/src/components/StatusBadge.tsx
import type { SyncLog } from '../services/types';

const LABELS: Record<SyncLog['status'], string> = {
  success: '✓ Sucesso',
  error:   '✗ Erro',
  running: '⟳ Executando',
};

interface StatusBadgeProps {
  status: SyncLog['status'];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {LABELS[status]}
    </span>
  );
}
