import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronRight, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Sesión iniciada con Google");
    } catch (error) {
      console.error(error);
      toast.error("Error al iniciar sesión con Google");
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

      <div className="space-y-6">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-white text-black py-4 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Continuar con Google
            </>
          )}
        </button>

        <p className="text-[10px] text-center text-white/20 uppercase tracking-widest font-bold px-8">
          Al continuar, aceptas nuestros términos de servicio y política de privacidad.
        </p>
      </div>
    </div>
  );
}
  );
}
