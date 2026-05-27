import { History, Home, Plus, User, Wallet } from 'lucide-react';

const items = [
  ['home', Home, 'Hoje'],
  ['bills', Wallet, 'Contas'],
  ['add', Plus, 'Nova'],
  ['history', History, 'Histórico'],
  ['profile', User, 'Perfil']
];

export function BottomNavigation({ screen, setScreen }) {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {items.map(([id, Icon, label]) => (
        <button key={id} type="button" className={screen === id ? 'active' : ''} onClick={() => setScreen(id)}>
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
