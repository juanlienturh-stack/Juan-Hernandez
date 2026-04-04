import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { Scans } from './pages/Scans';
import { Nutrition } from './pages/Nutrition';
import { Exercise } from './pages/Exercise';
import { Style } from './pages/Style';
import { History } from './pages/History';
import { Steps } from './pages/Steps';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { auth, db, onAuthStateChanged, signOut, type User, doc, getDocFromServer } from './firebase';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4 italic uppercase tracking-tighter">Algo salió mal</h2>
          <p className="text-white/60 mb-8 text-sm">Lo sentimos, ha ocurrido un error inesperado.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-orange-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs"
          >
            Reintentar
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-4 bg-zinc-900 rounded-xl text-left text-[10px] text-red-400 overflow-auto max-w-full">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Test Firestore connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <Login />
        <Toaster position="top-center" theme="dark" richColors />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="max-w-md mx-auto bg-black min-h-screen relative shadow-2xl shadow-orange-500/10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scans" element={<Scans />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/exercise" element={<Exercise />} />
            <Route path="/steps" element={<Steps />} />
            <Route path="/style" element={<Style />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Navigation />
          <Toaster position="top-center" theme="dark" richColors />
        </div>
      </Router>
    </ErrorBoundary>
  );
}
