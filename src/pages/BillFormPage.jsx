import { useMemo, useState } from 'react';
import { Save, X } from 'lucide-react';
import { todayISO } from '../utils/date.js';
import { validateBillForm } from '../utils/validation.js';

export function BillFormPage({ house, bill = null, modal = false, onDone }) {
  const { data, actions } = house;
  const initialValues = useMemo(() => ({
    id: bill?.id,
    title: bill?.title || '',
    amount: bill?.amount || '',
    dueDate: bill?.dueDate || todayISO(),
    category: bill?.category || 'Casa',
    assignedTo: bill?.assignedTo || data.people[0]?.name || '',
    status: bill?.status || 'pending',
    paidBy: bill?.paidBy,
    paidAt: bill?.paidAt,
    createdAt: bill?.createdAt
  }), [bill, data.people]);

  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function change(field, value) {
    setForm(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateBillForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = { ...form, title: form.title.trim(), category: form.category.trim(), amount: Number(form.amount) };
    if (bill?.id) actions.updateBill(payload);
    else actions.addBill(payload);
    onDone?.();
  }

  const content = (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-head">
        <h2>{bill?.id ? 'Editar conta' : 'Nova conta'}</h2>
        {modal && <button className="icon-button" type="button" aria-label="Fechar" onClick={onDone}><X /></button>}
      </div>
      <label>
        Nome
        <input value={form.title} onChange={event => change('title', event.target.value)} placeholder="Ex: Energia" />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </label>
      <label>
        Valor
        <input type="number" min="0.01" step="0.01" inputMode="decimal" value={form.amount} onChange={event => change('amount', event.target.value)} />
        {errors.amount && <span className="field-error">{errors.amount}</span>}
      </label>
      <label>
        Vencimento
        <input type="date" value={form.dueDate} onChange={event => change('dueDate', event.target.value)} />
        {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
      </label>
      <label>
        Responsável
        <select value={form.assignedTo} onChange={event => change('assignedTo', event.target.value)}>
          {data.people.map(person => <option key={person.id || person.name} value={person.name}>{person.name}</option>)}
        </select>
        {errors.assignedTo && <span className="field-error">{errors.assignedTo}</span>}
      </label>
      <label>
        Categoria
        <input value={form.category} onChange={event => change('category', event.target.value)} placeholder="Casa, Serviços, Cartão..." />
        {errors.category && <span className="field-error">{errors.category}</span>}
      </label>
      <button className="primary-button" type="submit"><Save size={17} /> Salvar conta</button>
    </form>
  );

  if (modal) return <div className="overlay">{content}</div>;
  return content;
}
