import { LogOut, Moon, RefreshCw, Sun } from 'lucide-react';
import { SyncStatus } from './SyncStatus.jsx';

export function AppHeader({ data, syncState, onToggleTheme, onLogout }) {
  return (
    <header className="app-header">
      <div>
        <p className="muted">{data.family.name}</p>
        <h1>Hoje</h1>
      </div>
      <div className="top-actions">
        <SyncStatus state={syncState} />
        <button className="icon-button" type="button" aria-label="Alternar tema" onClick={onToggleTheme}>
          {data.theme === 'light' ? <Moon /> : <Sun />}
        </button>
        <button className="icon-button hide-small" type="button" aria-label="Sair" onClick={onLogout}>
          <LogOut />
        </button>
      </div>
    </header>
  );
}
