import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Flame, Footprints, Heart, TrendingUp, User as UserIcon, Bell, Brain, Trophy, Zap, X, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const data = [
  { name: 'Lun', steps: 4000, calories: 2400 },
  { name: 'Mar', steps: 3000, calories: 1398 },
  { name: 'Mie', steps: 2000, calories: 9800 },
  { name: 'Jue', steps: 2780, calories: 3908 },
  { name: 'Vie', steps: 1890, calories: 4800 },
  { name: 'Sab', steps: 2390, calories: 3800 },
  { name: 'Dom', steps: 3490, calories: 4300 },
];

function QuickAction({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 hover:bg-white/[0.02] transition-all active:scale-95"
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/5", color)}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</span>
    </button>
  );
}

export function Dashboard() {
  const [activeModal, setActiveModal] = useState<'mood' | 'challenges' | 'fatigue' | null>(null);

  const moods = [
    { label: 'Increíble', emoji: '🔥', color: 'bg-orange-500' },
    { label: 'Bien', emoji: '😊', color: 'bg-green-500' },
    { label: 'Cansado', emoji: '😴', color: 'bg-blue-500' },
    { label: 'Estresado', emoji: '🤯', color: 'bg-red-500' },
  ];

  const challenges = [
    { title: 'Guerrero de Hierro', detail: '7 días seguidos de gym', progress: 85, icon: <Zap size={16} /> },
    { title: 'Hidratación Pro', detail: 'Beber 3L de agua hoy', progress: 60, icon: <Heart size={16} /> },
    { title: 'Caminante Nocturno', detail: '5,000 pasos tras cena', progress: 0, icon: <Footprints size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[100] flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-zinc-900 w-full max-w-md rounded-[40px] border border-white/10 p-8 relative"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 text-white/20 hover:text-white"
              >
                <X size={24} />
              </button>

              {activeModal === 'mood' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold uppercase italic tracking-tighter">¿Cómo te sientes hoy?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {moods.map((mood) => (
                      <button
                        key={mood.label}
                        onClick={() => {
                          toast.success(`Estado de ánimo guardado: ${mood.label}`);
                          setActiveModal(null);
                        }}
                        className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-col items-center gap-3 hover:bg-white/10 transition-all"
                      >
                        <span className="text-4xl">{mood.emoji}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'challenges' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold uppercase italic tracking-tighter">Retos Activos</h3>
                  <div className="space-y-4">
                    {challenges.map((challenge) => (
                      <div key={challenge.title} className="bg-white/5 p-5 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                            {challenge.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-sm">{challenge.title}</h4>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">{challenge.detail}</p>
                          </div>
                          <span className="text-xs font-bold text-orange-500">{challenge.progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500" style={{ width: `${challenge.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'fatigue' && (
                <div className="space-y-6 text-center">
                  <Zap size={48} className="text-blue-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold uppercase italic tracking-tighter">Análisis de Fatiga</h3>
                  <p className="text-sm text-white/40">Basado en tu sueño y actividad, tu nivel de fatiga es:</p>
                  <div className="text-5xl font-bold tracking-tighter text-blue-500 my-6">BAJO</div>
                  <div className="bg-blue-500/10 p-5 rounded-3xl border border-blue-500/20 text-left">
                    <p className="text-xs text-blue-200/60 leading-relaxed">
                      Estás en condiciones óptimas para un entrenamiento de alta intensidad. Tu recuperación ha sido del 92%.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="w-full bg-white text-black py-4 rounded-2xl font-bold uppercase tracking-widest"
                  >
                    Entendido
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase italic">Vitalis AI</h1>
          <p className="text-white/50 text-sm">Bienvenido de nuevo, Guerrero.</p>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/5 text-white/40">
            <Bell size={20} />
          </button>
          <Link to="/profile" className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <UserIcon size={20} />
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-zinc-900 p-6 rounded-[32px] border border-white/5 flex flex-col gap-3 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl" />
          <Footprints className="text-orange-500" size={28} />
          <div>
            <span className="text-4xl font-bold tracking-tighter block">8,432</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Pasos Hoy</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-orange-500 w-[84%]" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-zinc-900 p-6 rounded-[32px] border border-white/5 flex flex-col gap-3 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-500/10 rounded-full blur-2xl" />
          <Flame className="text-red-500" size={28} />
          <div>
            <span className="text-4xl font-bold tracking-tighter block">1,240</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Kcal Activas</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-red-500 w-[62%]" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <QuickAction 
          icon={<Brain size={20} />} 
          label="Ánimo" 
          color="text-purple-500" 
          onClick={() => setActiveModal('mood')}
        />
        <QuickAction 
          icon={<Trophy size={20} />} 
          label="Retos" 
          color="text-yellow-500" 
          onClick={() => setActiveModal('challenges')}
        />
        <QuickAction 
          icon={<Zap size={20} />} 
          label="Fatiga" 
          color="text-blue-500" 
          onClick={() => setActiveModal('fatigue')}
        />
      </div>

      <div className="bg-zinc-900 p-6 rounded-[40px] border border-white/5 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold uppercase italic tracking-wider flex items-center gap-2">
            <TrendingUp size={20} className="text-orange-500" />
            Rendimiento Semanal
          </h2>
          <select className="bg-transparent text-[10px] font-bold uppercase tracking-widest text-white/40 outline-none">
            <option>Pasos</option>
            <option>Calorías</option>
          </select>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
              <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '16px', fontSize: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="steps" stroke="#f97316" fillOpacity={1} fill="url(#colorSteps)" strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Objetivos Diarios</h2>
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Ver Todos</span>
        </div>
        <div className="bg-zinc-900 p-5 rounded-3xl border border-white/5 flex items-center gap-5 group hover:bg-white/[0.02] transition-all">
          <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity className="text-orange-500" size={28} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base">Entrenamiento de Pecho</h3>
            <p className="text-xs text-white/40 uppercase tracking-widest font-medium">18:00 • Gimnasio Central</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="bg-zinc-900 p-5 rounded-3xl border border-white/5 flex items-center gap-5 group hover:bg-white/[0.02] transition-all">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Heart className="text-blue-500" size={28} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base">Meditación Zen</h3>
            <p className="text-xs text-white/40 uppercase tracking-widest font-medium">10 min • Enfoque Mental</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

