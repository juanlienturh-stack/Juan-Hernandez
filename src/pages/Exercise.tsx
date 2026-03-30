import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Plus, Play, Info, Sparkles, ChevronRight, Timer, Mic, Video } from 'lucide-react';
import { generateRoutine } from '../lib/gemini';
import type { Exercise, Routine } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const exerciseGroups = [
  { id: 'chest', label: 'Pecho', icon: <Dumbbell size={16} /> },
  { id: 'back', label: 'Espalda', icon: <Dumbbell size={16} /> },
  { id: 'shoulders', label: 'Hombros', icon: <Dumbbell size={16} /> },
  { id: 'legs', label: 'Piernas', icon: <Dumbbell size={16} /> },
  { id: 'arms', label: 'Brazos', icon: <Dumbbell size={16} /> },
  { id: 'abs', label: 'Abdominales', icon: <Dumbbell size={16} /> },
];

const chestExercises: Exercise[] = [
  { id: 'c1', name: 'Press de banca con barra', group: 'chest', focus: 'Pectoral mayor', description: 'Empuje horizontal con barra.' },
  { id: 'c2', name: 'Press inclinado con mancuernas', group: 'chest', focus: 'Pectoral superior', description: 'Empuje inclinado para la parte alta.' },
  { id: 'c3', name: 'Aperturas con mancuernas', group: 'chest', focus: 'Estiramiento pectoral', description: 'Apertura lateral controlada.' },
  { id: 'c4', name: 'Fondos en paralelas', group: 'chest', focus: 'Pectoral inferior', description: 'Empuje vertical hacia abajo.' },
  { id: 'c5', name: 'Cruce de poleas', group: 'chest', focus: 'Pectoral interno', description: 'Contracción máxima en el centro.' },
];

export function Exercise() {
  const [routines, setRoutines] = useState<Routine[]>(() => {
    const saved = localStorage.getItem('vitalis_routines');
    return saved ? JSON.parse(saved) : [];
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'routines' | 'exercises'>('routines');
  const [activeWorkout, setActiveWorkout] = useState<Routine | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem('vitalis_routines', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerateRoutine = async () => {
    setIsGenerating(true);
    try {
      const result = await generateRoutine("Rutina de 3 días para hipertrofia enfocada en pecho y espalda");
      const newRoutine: Routine = {
        id: Math.random().toString(36).substr(2, 9),
        name: result.name || 'Nueva Rutina IA',
        exercises: result.exercises || []
      };
      setRoutines([newRoutine, ...routines]);
      toast.success("Rutina generada con éxito");
    } catch (error) {
      console.error(error);
      toast.error("Error al generar la rutina");
    } finally {
      setIsGenerating(false);
    }
  };

  const startWorkout = (routine: Routine) => {
    setActiveWorkout(routine);
    setTimer(0);
    setIsTimerRunning(true);
    toast.success(`Entrenamiento iniciado: ${routine.name}`);
  };

  const finishWorkout = () => {
    if (!activeWorkout) return;
    const historyEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'workout',
      name: activeWorkout.name,
      duration: formatTime(timer),
      date: new Date().toISOString()
    };
    const history = JSON.parse(localStorage.getItem('vitalis_history') || '[]');
    localStorage.setItem('vitalis_history', JSON.stringify([historyEntry, ...history]));
    
    setActiveWorkout(null);
    setIsTimerRunning(false);
    setTimer(0);
    toast.success("¡Entrenamiento completado! Guardado en el historial.");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tighter uppercase italic">Entrenamiento</h1>
        <p className="text-white/50 text-sm">Forja tu cuerpo con ciencia y disciplina.</p>
      </header>

      <div className="flex bg-zinc-900 p-1 rounded-2xl mb-8 border border-white/5">
        <button
          onClick={() => setActiveTab('routines')}
          className={cn(
            "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'routines' ? "bg-orange-500 text-white shadow-lg" : "text-white/40"
          )}
        >
          Mis Rutinas
        </button>
        <button
          onClick={() => setActiveTab('exercises')}
          className={cn(
            "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'exercises' ? "bg-orange-500 text-white shadow-lg" : "text-white/40"
          )}
        >
          Ejercicios
        </button>
      </div>

      {activeTab === 'routines' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGenerateRoutine}
              disabled={isGenerating}
              className="bg-zinc-900 p-6 rounded-3xl border border-white/5 flex flex-col items-center gap-3 hover:bg-orange-500/10 transition-all group relative overflow-hidden"
            >
              {isGenerating && (
                <motion.div
                  className="absolute inset-0 bg-orange-500/20"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              <Sparkles className="text-orange-500 group-hover:scale-110 transition-transform" size={32} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-center">Generar con IA</span>
            </button>
            <button className="bg-zinc-900 p-6 rounded-3xl border border-white/5 flex flex-col items-center gap-3 hover:bg-orange-500/10 transition-all group">
              <Plus className="text-orange-500 group-hover:scale-110 transition-transform" size={32} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-center">Crear Manual</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 hover:bg-orange-500/10 transition-all group">
              <Mic className="text-orange-500 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Coach de Voz</span>
            </button>
            <button className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 hover:bg-orange-500/10 transition-all group">
              <Video className="text-orange-500 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Análisis Video</span>
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Tus Rutinas Guardadas</h2>
            {routines.map((routine) => (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-orange-500/50 transition-all"
              >
                <div>
                  <h3 className="font-bold text-lg mb-1">{routine.name}</h3>
                  <p className="text-xs text-white/40 uppercase tracking-widest">{routine.exercises.length} Ejercicios • 45 min</p>
                </div>
                <button 
                  onClick={() => startWorkout(routine)}
                  className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform"
                >
                  <Play size={20} fill="currentColor" />
                </button>
              </motion.div>
            ))}
            {routines.length === 0 && (
              <div className="p-12 rounded-3xl border border-dashed border-white/5 text-center">
                <p className="text-xs text-white/20 uppercase tracking-widest italic">No tienes rutinas aún</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {exerciseGroups.map((group) => (
            <div key={group.id} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                {group.icon}
                {group.label}
              </h3>
              <div className="space-y-2">
                {chestExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/[0.02] transition-all"
                  >
                    <div>
                      <h4 className="font-bold text-sm">{exercise.name}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{exercise.focus}</p>
                    </div>
                    <button className="text-white/20 hover:text-white transition-colors">
                      <Info size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Workout Overlay */}
      <AnimatePresence>
        {activeWorkout && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-0 bg-black z-50 p-6 flex flex-col"
          >
            <header className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold uppercase italic tracking-tighter">{activeWorkout.name}</h2>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">En Progreso • {formatTime(timer)}</p>
              </div>
              <button 
                onClick={finishWorkout}
                className="bg-red-500 px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-red-500/20"
              >
                Finalizar
              </button>
            </header>

            <div className="flex-1 overflow-y-auto space-y-4">
              {activeWorkout.exercises.map((exercise, idx) => (
                <div key={idx} className="bg-zinc-900 p-5 rounded-3xl border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-orange-500 font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{exercise.name}</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{exercise.sets} series • {exercise.reps} reps</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-white/10" />
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="bg-zinc-900 h-16 rounded-2xl border border-white/5 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs"
              >
                <Timer size={20} className={cn(isTimerRunning ? "text-orange-500" : "text-white/20")} />
                {isTimerRunning ? 'Pausar' : 'Reanudar'}
              </button>
              <button className="bg-zinc-900 h-16 rounded-2xl border border-white/5 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs">
                <Mic size={20} className="text-blue-500" />
                Voz
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
