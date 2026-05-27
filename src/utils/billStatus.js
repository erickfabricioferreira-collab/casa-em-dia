import { daysUntil } from './date.js';

export function getBillStatus(bill) {
  if (bill.status === 'paid') return 'paid';
  const diff = daysUntil(bill.dueDate);
  if (diff < 0) return 'late';
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff <= 3) return 'soon';
  return 'future';
}

export function getStatusLabel(bill) {
  const status = getBillStatus(bill);
  const labels = {
    paid: 'Paga',
    late: 'Atrasada',
    today: 'Vence hoje',
    tomorrow: 'Amanhã',
    soon: 'Próxima',
    future: 'Futura'
  };
  return labels[status] || 'Pendente';
}

export function sortBillsByPriority(bills) {
  const weight = { late: 1, today: 2, tomorrow: 3, soon: 4, future: 5, paid: 6 };
  return [...bills].sort((a, b) => {
    const statusDiff = weight[getBillStatus(a)] - weight[getBillStatus(b)];
    if (statusDiff !== 0) return statusDiff;
    return new Date(`${a.dueDate}T12:00:00`) - new Date(`${b.dueDate}T12:00:00`);
  });
}
