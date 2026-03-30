import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Footprints, MapPin, Navigation as NavIcon, Play, Square, TrendingUp, Calendar, Watch, Smartphone } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const stepData = [
  { time: '08:00', steps: 200 },
  { time: '10:00', steps: 1200 },
  { time: '12:00', steps: 3400 },
  { time: '14:00', steps: 4500 },
  { time: '16:00', steps: 6700 },
  { time: '18:00', steps: 8432 },
];

export function Steps() {
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isTracking) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
        setDistance(prev => prev + 0.001); // Mock distance
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTracking = () => {
    if (isTracking) {
      // Save to history
      const historyEntry = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'steps',
        date: new Date().toISOString().split('T')[0],
        title: 'Sesión de Cardio GPS',
        detail: `${distance.toFixed(2)} km • ${formatTime(time)}`,
        icon: 'Footprints'
      };
      const history = JSON.parse(localStorage.getItem('vitalis_history') || '[]');
      localStorage.setItem('vitalis_history', JSON.stringify([historyEntry, ...history]));
      
      toast.success("Sesión guardada en el historial");
      setIsTracking(false);
      setTime(0);
      setDistance(0);
    } else {
      setIsTracking(true);
      toast.info("Sesión iniciada");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tighter uppercase italic">Actividad</h1>
        <p className="text-white/50 text-sm">Cada paso cuenta en tu camino al éxito.</p>
      </header>

      <div className="bg-zinc-900 p-8 rounded-[40px] border border-white/5 text-center mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-500/5 animate-pulse" />
        <div className="relative z-10">
          <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Footprints size={40} className="text-orange-500" />
          </div>
          <span className="text-6xl font-bold tracking-tighter block mb-2">8,432</span>
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">Pasos Totales Hoy</span>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl">
              <span className="text-xl font-bold block">6.2</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">Kilómetros</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl">
              <span className="text-xl font-bold block">420</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">Kcal Activas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex items-center justify-center gap-2 hover:bg-white/[0.02] transition-all">
          <Watch size={18} className="text-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Sincronizar Reloj</span>
        </button>
        <button className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex items-center justify-center gap-2 hover:bg-white/[0.02] transition-all">
          <Smartphone size={18} className="text-green-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Google Fit</span>
        </button>
      </div>

      <div className="bg-zinc-900 p-6 rounded-[40px] border border-white/5 mb-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
          <TrendingUp size={16} className="text-orange-500" />
          Actividad por Hora
        </h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stepData}>
              <XAxis dataKey="time" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
              <Area type="monotone" dataKey="steps" stroke="#f97316" fill="#f9731620" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-[40px] border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
            <NavIcon size={16} className="text-blue-500" />
            Sesión de Cardio GPS
          </h3>
          {isTracking && (
            <span className="flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              Grabando
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Tiempo</span>
            <span className="text-3xl font-bold tracking-tighter tabular-nums">{formatTime(time)}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Distancia</span>
            <span className="text-3xl font-bold tracking-tighter tabular-nums">{distance.toFixed(2)} km</span>
          </div>
        </div>

        <button
          onClick={toggleTracking}
          className={cn(
            "w-full py-4 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95",
            isTracking ? "bg-red-500 text-white" : "bg-white text-black"
          )}
        >
          {isTracking ? (
            <>
              <Square size={20} fill="currentColor" />
              Detener Sesión
            </>
          ) : (
            <>
              <Play size={20} fill="currentColor" />
              Iniciar Carrera/Caminata
            </>
          )}
        </button>
      </div>
    </div>
  );
}
