import { useState } from 'react';
import { BillCard } from '../components/BillCard.jsx';
import { ConfirmDialog } from '../components/ConfirmDialog.jsx';
import { Section } from '../components/Section.jsx';
import { BillFormPage } from './BillFormPage.jsx';

export function BillsPage({ house, showToast }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const { data, groups, actions } = house;

  function handlePay(id, person) {
    const paid = actions.payBill(id, person);
    if (paid) {
      navigator.vibrate?.(35);
      showToast('✓ Conta paga com sucesso — Casa ficando em dia ✨');
    }
  }

  function confirmDelete() {
    actions.removeBill(deleting.id);
    setDeleting(null);
    showToast('Conta excluída.');
  }

  return (
    <>
      <Section title="Todas as contas" empty="Nenhuma conta cadastrada.">
        {groups.all.map(bill => (
          <BillCard key={bill.id} bill={bill} people={data.people} onPay={handlePay} onEdit={setEditing} onDelete={setDeleting} />
        ))}
      </Section>
      {editing && <BillFormPage house={house} bill={editing} modal onDone={() => setEditing(null)} />}
      {deleting && (
        <ConfirmDialog
          title="Excluir conta?"
          message={`Deseja excluir ${deleting.title}? Essa ação remove também o histórico ligado a essa conta.`}
          confirmLabel="Excluir"
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}
