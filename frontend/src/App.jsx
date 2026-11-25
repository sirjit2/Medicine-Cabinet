import React, { useState, useEffect } from 'react';
import { ThemeContext } from './context/ThemeContext';
import { AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Medications from './pages/Medications';
import Interactions from './pages/Interactions';
import SideEffects from './pages/SideEffects';
import Timeline from './pages/Timeline';
import Reports from './pages/Reports';
import LandingPage from './pages/LandingPage';
import Toast from './components/Toast';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: '2024-01-15',
      endDate: '',
      doctor: 'Dr. Sarah Chen',
      category: 'Diabetes',
      color: '#06b6d4',
      notes: 'Take with meals to reduce stomach upset',
      active: true,
    },
    {
      id: 2,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      startDate: '2023-11-01',
      endDate: '',
      doctor: 'Dr. James Wilson',
      category: 'Blood Pressure',
      color: '#10b981',
      notes: 'Take in the morning',
      active: true,
    },
    {
      id: 3,
      name: 'Vitamin D3',
      dosage: '1000 IU',
      frequency: 'Once daily',
      startDate: '2024-03-01',
      endDate: '',
      doctor: 'Self',
      category: 'Supplement',
      color: '#f59e0b',
      notes: '',
      active: true,
    },
    {
      id: 4,
      name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once nightly',
      startDate: '2023-09-10',
      endDate: '',
      doctor: 'Dr. Sarah Chen',
      category: 'Cholesterol',
      color: '#8b5cf6',
      notes: 'Take at bedtime for best results',
      active: true,
    },
  ]);

  const [sideEffects, setSideEffects] = useState([
    { id: 1, date: '2024-06-10', symptom: 'Nausea', severity: 3, linkedMeds: [1], notes: 'Happened after morning dose' },
    { id: 2, date: '2024-06-12', symptom: 'Dizziness', severity: 2, linkedMeds: [2], notes: 'Mild, resolved after an hour' },
    { id: 3, date: '2024-06-15', symptom: 'Fatigue', severity: 4, linkedMeds: [1, 4], notes: 'Very tired mid-afternoon' },
    { id: 4, date: '2024-06-18', symptom: 'Headache', severity: 2, linkedMeds: [2], notes: '' },
  ]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const appContextValue = {
    medications, setMedications,
    sideEffects, setSideEffects,
    activePage, setActivePage,
    sidebarOpen, setSidebarOpen,
    addToast,
  };

  const themeContextValue = {
    theme, toggleTheme,
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'medications': return <Medications />;
      case 'interactions': return <Interactions />;
      case 'sideeffects': return <SideEffects />;
      case 'timeline': return <Timeline />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return (
      <ThemeContext.Provider value={themeContextValue}>
        <AppContext.Provider value={appContextValue}>
          <LandingPage onLogin={() => setIsLoggedIn(true)} />
          <Toast toasts={toasts} />
        </AppContext.Provider>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <AppContext.Provider value={appContextValue}>
        <div className="app-layout">
          <Sidebar />
          <div className={`app-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <Navbar onLogout={() => setIsLoggedIn(false)} />
            <main className="app-content">
              {renderPage()}
            </main>
          </div>
        </div>
        <Toast toasts={toasts} />
      </AppContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
