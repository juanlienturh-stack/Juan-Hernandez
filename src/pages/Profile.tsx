import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Settings, Bell, Shield, LogOut, ChevronRight, CreditCard, HelpCircle, Moon, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';

export function Profile() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const user = auth.currentUser;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <header className="mb-12 text-center">
        <div className="relative inline-block mb-6">
          <div className="w-32 h-32 rounded-[40px] bg-orange-500 p-1 shadow-2xl shadow-orange-500/20">
            <img
              src={user?.photoURL || "https://picsum.photos/seed/user/300/300"}
              alt="Profile"
              className="w-full h-full object-cover rounded-[38px]"
              referrerPolicy="no-referrer"
            />
          </div>
          <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-black rounded-2xl flex items-center justify-center shadow-xl border-4 border-black">
            <Settings size={18} />
          </button>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter uppercase italic">{user?.displayName || "Guerrero"}</h1>
        <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Nivel 24 • Guerrero de Élite</p>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-12">
        <StatCard label="Peso" value="78.5" unit="kg" />
        <StatCard label="Altura" value="182" unit="cm" />
        <StatCard label="Grasa" value="14.2" unit="%" />
      </div>

      <div className="space-y-8">
        <Section title="Cuenta">
          <MenuItem icon={<User size={18} />} label="Información Personal" />
          <MenuItem icon={<CreditCard size={18} />} label="Suscripción Premium" badge="Activa" />
          <MenuItem icon={<Globe size={18} />} label="Idioma" detail="Español" />
        </Section>

        <Section title="Preferencias">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40">
                <Moon size={18} />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest">Modo Oscuro</span>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={cn(
                "w-12 h-6 rounded-full transition-all relative",
                isDarkMode ? "bg-orange-500" : "bg-white/10"
              )}
            >
              <motion.div
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-lg"
                animate={{ x: isDarkMode ? 24 : 0 }}
              />
            </button>
          </div>
          <MenuItem icon={<Bell size={18} />} label="Notificaciones" />
          <MenuItem icon={<Shield size={18} />} label="Privacidad y Seguridad" />
        </Section>

        <Section title="Soporte">
          <MenuItem icon={<HelpCircle size={18} />} label="Centro de Ayuda" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all group"
          >
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <LogOut size={18} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Cerrar Sesión</span>
          </button>
        </Section>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit }: { label: string, value: string, unit: string }) {
  return (
    <div className="bg-zinc-900 p-4 rounded-3xl border border-white/5 text-center">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">{label}</span>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-2xl font-bold tracking-tighter">{value}</span>
        <span className="text-[10px] text-white/20 font-bold">{unit}</span>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">{title}</h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function MenuItem({ icon, label, detail, badge }: { icon: React.ReactNode, label: string, detail?: string, badge?: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-orange-500 transition-colors">
          {icon}
        </div>
        <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {detail && <span className="text-xs text-white/20 font-bold">{detail}</span>}
        {badge && <span className="text-[10px] bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest">{badge}</span>}
        <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
}
