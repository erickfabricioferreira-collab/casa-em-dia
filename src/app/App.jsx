import { Suspense, lazy, useEffect, useState } from 'react';
import { signOut, getSession } from '../services/authService.js';
import { useHashRoute } from '../hooks/useHashRoute.js';
import { useHouseData } from '../hooks/useHouseData.js';
import { useToast } from '../hooks/useToast.js';
import { AppHeader } from '../components/AppHeader.jsx';
import { BottomNavigation } from '../components/BottomNavigation.jsx';
import { Toast } from '../components/Toast.jsx';

const LoginPage = lazy(() => import('../pages/LoginPage.jsx').then(module => ({ default: module.LoginPage })));
const HomePage = lazy(() => import('../pages/HomePage.jsx').then(module => ({ default: module.HomePage })));
const BillsPage = lazy(() => import('../pages/BillsPage.jsx').then(module => ({ default: module.BillsPage })));
const BillFormPage = lazy(() => import('../pages/BillFormPage.jsx').then(module => ({ default: module.BillFormPage })));
const HistoryPage = lazy(() => import('../pages/HistoryPage.jsx').then(module => ({ default: module.HistoryPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage.jsx').then(module => ({ default: module.ProfilePage })));

function LoadingState() {
  return <div className="boot">Carregando sua casa...</div>;
}

export function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [screen, setScreen] = useHashRoute();
  const house = useHouseData();
  const { toast, showToast } = useToast();

  useEffect(() => {
    let mounted = true;
    getSession()
      .then(session => {
        if (mounted) setIsLogged(session.isLogged);
      })
      .catch(() => {
        if (mounted) setIsLogged(false);
      })
      .finally(() => {
        if (mounted) setIsBooting(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    await signOut();
    setIsLogged(false);
    setScreen('home');
  }

  if (isBooting) return <LoadingState />;

  if (!isLogged) {
    return (
      <Suspense fallback={<LoadingState />}>
        <LoginPage onLogin={() => setIsLogged(true)} />
      </Suspense>
    );
  }

  return (
    <div className="app-shell">
      <AppHeader data={house.data} syncState={house.syncState} onToggleTheme={house.actions.toggleTheme} onLogout={handleLogout} />
      {toast && <Toast message={toast} />}
      <main className="main-content">
        <Suspense fallback={<LoadingState />}>
          {screen === 'home' && <HomePage house={house} showToast={showToast} />}
          {screen === 'bills' && <BillsPage house={house} showToast={showToast} />}
          {screen === 'add' && <BillFormPage house={house} onDone={() => setScreen('home')} />}
          {screen === 'history' && <HistoryPage data={house.data} />}
          {screen === 'profile' && <ProfilePage house={house} showToast={showToast} onLogout={handleLogout} />}
        </Suspense>
      </main>
      <BottomNavigation screen={screen} setScreen={setScreen} />
    </div>
  );
}
