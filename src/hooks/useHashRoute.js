import { useEffect, useState } from 'react';

const validRoutes = new Set(['home', 'bills', 'add', 'history', 'profile']);

function readRoute() {
  const route = window.location.hash.replace('#/', '') || 'home';
  return validRoutes.has(route) ? route : 'home';
}

export function useHashRoute() {
  const [screen, setScreenState] = useState(readRoute);

  useEffect(() => {
    const onHashChange = () => setScreenState(readRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function setScreen(next) {
    window.location.hash = `/${validRoutes.has(next) ? next : 'home'}`;
  }

  return [screen, setScreen];
}
