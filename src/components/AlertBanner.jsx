import { daysUntil } from '../utils/date.js';
import { getBillStatus, sortBillsByPriority } from '../utils/billStatus.js';

export function AlertBanner({ bills }) {
  const bill = sortBillsByPriority(bills).find(item => item.status !== 'paid' && ['late', 'today', 'tomorrow', 'soon'].includes(getBillStatus(item)));
  if (!bill) return null;

  const diff = daysUntil(bill.dueDate);
  const message = diff < 0
    ? `⚠️ ${bill.title} está atrasada`
    : diff === 0
      ? `⚠️ ${bill.title} vence hoje`
      : diff === 1
        ? `⚠️ ${bill.title} vence amanhã`
        : `⚠️ ${bill.title} vence em ${diff} dias`;

  const helper = diff < 0
    ? 'Resolva primeiro para aliviar a casa.'
    : diff <= 1
      ? 'Ainda dá tempo de resolver com calma.'
      : 'Sem pressa, só para não esquecer.';

  return (
    <div className="alert-banner">
      <strong>{message}</strong>
      <span>{helper}</span>
    </div>
  );
}
