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
import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        {!user ? (
          <Login />
        ) : (
          <div className="max-w-md mx-auto bg-black min-h-screen relative shadow-2xl shadow-orange-500/10">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scans" element={<Scans />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/exercise" element={<Exercise />} />
              <Route path="/steps" element={<Steps />} />
              <Route path="/style" element={<Style />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Navigation />
          </div>
        )}
        <Toaster position="top-center" theme="dark" richColors />
      </Router>
    </ErrorBoundary>
  );
}


