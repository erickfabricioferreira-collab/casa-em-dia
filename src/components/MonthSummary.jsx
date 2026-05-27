import { useMemo } from 'react';
import { formatBRL } from '../utils/currency.js';

export function MonthSummary({ bills }) {
  const summary = useMemo(() => {
    const paid = bills.filter(bill => bill.status === 'paid').reduce((sum, bill) => sum + Number(bill.amount), 0);
    const pending = bills.filter(bill => bill.status !== 'paid').reduce((sum, bill) => sum + Number(bill.amount), 0);
    const progress = Math.round((paid / (paid + pending || 1)) * 100);
    return { paid, pending, progress };
  }, [bills]);

  return (
    <section className="month-summary" aria-label="Resumo do mês">
      <div>
        <p>Pendente</p>
        <strong>{formatBRL(summary.pending)}</strong>
      </div>
      <div>
        <p>Pago</p>
        <strong>{formatBRL(summary.paid)}</strong>
      </div>
      <div>
        <p>Progresso</p>
        <strong>{summary.progress}%</strong>
      </div>
    </section>
  );
}
