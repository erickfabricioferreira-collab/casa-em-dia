import { useEffect, useMemo, useState } from 'react';
import { createId } from '../utils/id.js';
import { todayISO } from '../utils/date.js';
import { getBillStatus, sortBillsByPriority } from '../utils/billStatus.js';
import { loadLocalData, saveLocalData } from '../services/storageService.js';

function cloneData(data) {
  return {
    ...data,
    bills: [...data.bills],
    payments: [...data.payments],
    people: [...data.people],
    family: { ...data.family },
    user: { ...data.user }
  };
}

export function useHouseData() {
  const [data, setData] = useState(loadLocalData);
  const [syncState, setSyncState] = useState('updated');

  useEffect(() => {
    document.body.dataset.theme = data.theme;
    saveLocalData(data);
    setSyncState(navigator.onLine ? 'updated' : 'offline');
  }, [data]);

  useEffect(() => {
    const online = () => setSyncState('updated');
    const offline = () => setSyncState('offline');
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  }, []);

  function updateData(recipe) {
    setSyncState('saving');
    setData(current => recipe(cloneData(current)));
  }

  const actions = useMemo(() => ({
    toggleTheme() {
      updateData(current => ({ ...current, theme: current.theme === 'light' ? 'dark' : 'light' }));
    },
    addBill(bill) {
      updateData(current => ({
        ...current,
        bills: [{ ...bill, id: createId('bill'), status: 'pending', createdAt: todayISO() }, ...current.bills]
      }));
    },
    updateBill(bill) {
      updateData(current => ({
        ...current,
        bills: current.bills.map(item => item.id === bill.id ? { ...item, ...bill } : item)
      }));
    },
    removeBill(id) {
      updateData(current => ({
        ...current,
        bills: current.bills.filter(item => item.id !== id),
        payments: current.payments.filter(item => item.billId !== id)
      }));
    },
    payBill(id, paidBy) {
      let paid = null;
      updateData(current => {
        const bill = current.bills.find(item => item.id === id);
        if (!bill || bill.status === 'paid') return current;
        const payer = paidBy || bill.assignedTo || current.user.name;
        paid = { ...bill, status: 'paid', paidBy: payer, paidAt: todayISO() };
        return {
          ...current,
          bills: current.bills.map(item => item.id === id ? paid : item),
          payments: [
            { id: createId('payment'), billId: bill.id, snapshotTitle: bill.title, amount: Number(bill.amount), paidBy: payer, paidAt: todayISO(), notes: '' },
            ...current.payments
          ]
        };
      });
      return paid;
    },
    updateUser(user) {
      updateData(current => ({
        ...current,
        user,
        people: current.people.map(person => person.id === current.user.id || person.name === current.user.name ? { ...person, ...user } : person)
      }));
    },
    updatePerson(person) {
      updateData(current => ({
        ...current,
        people: current.people.map(item => item.id === person.id ? { ...item, ...person } : item)
      }));
    }
  }), []);

  const groups = useMemo(() => {
    const sorted = sortBillsByPriority(data.bills);
    return {
      urgent: sorted.filter(bill => ['late', 'today'].includes(getBillStatus(bill)) && bill.status !== 'paid'),
      next: sorted.filter(bill => ['tomorrow', 'soon'].includes(getBillStatus(bill)) && bill.status !== 'paid'),
      paid: sorted.filter(bill => bill.status === 'paid').slice(0, 4),
      all: sorted
    };
  }, [data.bills]);

  return { data, groups, actions, syncState };
}
