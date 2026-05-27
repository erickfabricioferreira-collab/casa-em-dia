import { CheckCircle2 } from 'lucide-react';
import { Section } from '../components/Section.jsx';
import { formatBRL } from '../utils/currency.js';
import { formatLongDate } from '../utils/date.js';

export function HistoryPage({ data }) {
  return (
    <Section title="Histórico mensal" empty="Nenhuma conta paga ainda.\nQuando alguém pagar, o histórico aparece aqui.">
      {data.payments.map(payment => (
        <article className="history-row" key={payment.id}>
          <span><CheckCircle2 size={18} /> {payment.snapshotTitle || payment.billTitle}</span>
          <strong>{formatBRL(payment.amount)}</strong>
          <small>{payment.paidBy} • {formatLongDate(payment.paidAt)}</small>
        </article>
      ))}
    </Section>
  );
}
