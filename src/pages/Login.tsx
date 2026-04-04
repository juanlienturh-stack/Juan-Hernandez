import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, Sparkles, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  doc, 
  setDoc, 
  getDoc 
} from '../firebase';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthError = (error: any) => {
    console.error("Auth error:", error);
    let message = "Ha ocurrido un error";
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      message = "Email o contraseña incorrectos";
    } else if (error.code === 'auth/email-already-in-use') {
      message = "Este email ya está en uso";
    } else if (error.code === 'auth/weak-password') {
      message = "La contraseña es muy débil";
    } else if (error.code === 'auth/invalid-email') {
      message = "Email inválido";
    }
    toast.error(message);
  };

  const createUserProfile = async (user: any) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Usuario Vitalis',
        photoURL: user.photoURL || `https://picsum.photos/seed/${user.uid}/300/300`,
        level: 1,
        title: 'Guerrero Novato',
        weight: 0,
        height: 0,
        bodyFat: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(userCredential.user);
        toast.success("Cuenta creada con éxito");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Sesión iniciada");
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
      toast.success("Sesión iniciada con Google");
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 bg-orange-500 rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/20">
          <Sparkles size={40} className="text-white" />
        </div>
        <h1 className="text-5xl font-bold tracking-tighter uppercase italic mb-2">Vitalis AI</h1>
        <p className="text-white/40 text-sm uppercase tracking-widest font-bold">Tu Asistente de Salud Inteligente</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-orange-500 outline-none transition-all disabled:opacity-50"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-orange-500 outline-none transition-all disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-black py-4 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          disabled={isLoading}
          className="text-xs text-white/40 hover:text-orange-500 transition-colors uppercase tracking-widest font-bold disabled:opacity-50"
        >
          {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>

      <div className="mt-12 flex items-center gap-4">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">O continúa con</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4">
        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="bg-zinc-900 border border-white/5 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all disabled:opacity-50"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale" alt="Google" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Google</span>
        </button>
      </div>
    </div>
  );
}
