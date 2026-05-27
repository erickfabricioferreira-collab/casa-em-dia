import { CheckCircle2, RefreshCw, WifiOff } from 'lucide-react';

const copy = {
  updated: { text: 'Atualizado agora', Icon: CheckCircle2 },
  saving: { text: 'Salvando...', Icon: RefreshCw },
  offline: { text: 'Sem conexão', Icon: WifiOff }
};

export function SyncStatus({ state }) {
  const status = copy[state] || copy.updated;
  const Icon = status.Icon;
  return (
    <span className={`sync-status ${state}`}>
      <Icon size={13} /> {status.text}
    </span>
  );
}
