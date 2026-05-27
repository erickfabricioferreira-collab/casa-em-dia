import { CheckCircle2, Edit3, Trash2 } from 'lucide-react';
import { getBillStatus, getStatusLabel } from '../utils/billStatus.js';
import { formatShortDate } from '../utils/date.js';
import { formatBRL } from '../utils/currency.js';
import { UserAvatar } from './UserAvatar.jsx';

export function BillCard({ bill, people, onPay, onEdit, onDelete, compact = false }) {
  const payer = people.find(person => person.name === bill.paidBy) || people.find(person => person.name === bill.assignedTo) || people[0];
  const status = getBillStatus(bill);

  return (
    <article className={`bill-card ${status} ${compact ? 'compact' : ''}`}>
      <div className="bill-card__top">
        <div>
          <h3>{bill.title}</h3>
          <p>{bill.category} • vence {formatShortDate(bill.dueDate)}</p>
        </div>
        <span className="status-pill">{getStatusLabel(bill)}</span>
      </div>

      <strong className="bill-amount">{formatBRL(bill.amount)}</strong>

      <div className="bill-owner">
        <UserAvatar person={payer} />
        <span>{bill.status === 'paid' ? `Pago por ${bill.paidBy}` : `Responsável: ${bill.assignedTo}`}</span>
      </div>

      <div className="bill-actions">
        {bill.status !== 'paid' && (
          <button type="button" style={{ background: payer?.color }} onClick={() => onPay(bill.id, bill.assignedTo)}>
            <CheckCircle2 size={17} /> Pagar
          </button>
        )}
        <button className="ghost-button" type="button" onClick={() => onEdit(bill)}>
          <Edit3 size={16} /> Editar
        </button>
        {onDelete && (
          <button className="ghost-button danger" type="button" aria-label={`Excluir ${bill.title}`} onClick={() => onDelete(bill)}>
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </article>
  );
}
