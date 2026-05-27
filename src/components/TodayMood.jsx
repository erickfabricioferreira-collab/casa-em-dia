import { formatBRL } from '../utils/currency.js';

export function TodayMood({ urgentCount, nextCount, openTotal }) {
  const calm = urgentCount === 0;

  return (
    <section className={`today-mood ${calm ? 'calm' : 'attention'}`}>
      <div>
        <span>{calm ? '✨ Dia tranquilo' : '⚠️ Atenção hoje'}</span>
        <h2>{calm ? 'Sua casa está organizada.' : `${urgentCount} conta${urgentCount > 1 ? 's' : ''} precisam de cuidado.`}</h2>
        <p>{nextCount > 0 ? `${nextCount} próxima${nextCount > 1 ? 's' : ''} nos próximos dias.` : 'Nenhuma conta próxima incomodando agora.'}</p>
      </div>
      <strong>{formatBRL(openTotal)}</strong>
    </section>
  );
}
