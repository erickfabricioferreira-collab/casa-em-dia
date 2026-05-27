import { seedData } from '../data/seed.js';

const DATA_KEY = 'ocf-data-v2';
const LEGACY_KEY = 'ocf-data';
const SESSION_KEY = 'ocf-session';

function normalizeData(raw) {
  const data = raw || seedData;
  return {
    ...seedData,
    ...data,
    family: typeof data.family === 'string' ? { id: 'local-family', name: data.family } : data.family || seedData.family,
    people: Array.isArray(data.people) && data.people.length ? data.people : seedData.people,
    bills: Array.isArray(data.bills) ? data.bills : seedData.bills,
    payments: Array.isArray(data.payments) ? data.payments : seedData.payments,
    user: data.user || seedData.user,
    theme: data.theme || 'light'
  };
}

export function loadLocalData() {
  try {
    const current = localStorage.getItem(DATA_KEY);
    const legacy = localStorage.getItem(LEGACY_KEY);
    return normalizeData(JSON.parse(current || legacy) || seedData);
  } catch {
    return normalizeData(seedData);
  }
}

export function saveLocalData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(normalizeData(data)));
}

export function getLocalSession() {
  return localStorage.getItem(SESSION_KEY) === '1';
}

export function setLocalSession(isLogged) {
  if (isLogged) localStorage.setItem(SESSION_KEY, '1');
  else localStorage.removeItem(SESSION_KEY);
}
