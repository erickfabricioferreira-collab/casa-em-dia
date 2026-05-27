import { useState } from 'react';
import { AlertBanner } from '../components/AlertBanner.jsx';
import { BillCard } from '../components/BillCard.jsx';
import { MonthSummary } from '../components/MonthSummary.jsx';
import { Section } from '../components/Section.jsx';
import { TodayMood } from '../components/TodayMood.jsx';
import { BillFormPage } from './BillFormPage.jsx';

export function HomePage({ house, showToast }) {
  const [editing, setEditing] = useState(null);
  const { data, groups, actions } = house;
  const openTotal = [...groups.urgent, ...groups.next].reduce((sum, bill) => sum + Number(bill.amount || 0), 0);

  function handlePay(id, person) {
    const paid = actions.payBill(id, person);
    if (paid) {
      navigator.vibrate?.(35);
      showToast('✓ Conta paga com sucesso — Casa ficando em dia ✨');
    }
  }

  return (
    <>
      <TodayMood urgentCount={groups.urgent.length} nextCount={groups.next.length} openTotal={openTotal} />
      <AlertBanner bills={data.bills} />
      <Section title="Urgentes" empty="✨ Tudo tranquilo por aqui\nNenhuma conta urgente hoje.">
        {groups.urgent.map(bill => <BillCard key={bill.id} bill={bill} people={data.people} onPay={handlePay} onEdit={setEditing} />)}
      </Section>
      <Section title="Próximas" empty="Nenhuma conta nos próximos dias.">
        <div className="cards-grid">
          {groups.next.map(bill => <BillCard key={bill.id} bill={bill} people={data.people} onPay={handlePay} onEdit={setEditing} compact />)}
        </div>
      </Section>
      <MonthSummary bills={data.bills} />
      <Section title="Pagas recentemente" empty="Nenhuma conta paga ainda.">
        {groups.paid.map(bill => <BillCard key={bill.id} bill={bill} people={data.people} onPay={handlePay} onEdit={setEditing} />)}
      </Section>
      {editing && <BillFormPage house={house} bill={editing} modal onDone={() => setEditing(null)} />}
    </>
  );
}
