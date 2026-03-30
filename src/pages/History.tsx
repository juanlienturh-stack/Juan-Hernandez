import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History as HistoryIcon, Filter, Calendar, ChevronRight, Download, Share2, Trash2, FileText, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

import { toast } from 'sonner';

const filters = [
  { id: 'all', label: 'Todo' },
  { id: 'body', label: 'Cuerpo' },
  { id: 'face', label: 'Rostro' },
  { id: 'nutrition', label: 'Dieta' },
  { id: 'exercise', label: 'Rutinas' },
  { id: 'steps', label: 'Pasos' },
];

export function History() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [historyItems, setHistoryItems] = useState<any[]>(() => {
    const saved = localStorage.getItem('vitalis_history');
    return saved ? JSON.parse(saved) : [
      { id: '1', type: 'body', date: '2023-10-15', title: 'Escaneo Corporal 3D', detail: '18.4% Grasa • 42.1% Músculo', icon: 'User' },
      { id: '2', type: 'exercise', date: '2023-10-14', title: 'Rutina de Pecho', detail: '12 ejercicios • 520 kcal', icon: 'Dumbbell' },
      { id: '3', type: 'nutrition', date: '2023-10-14', title: 'Diario de Comida', detail: '2,450 kcal • P: 180g C: 220g G: 65g', icon: 'Utensils' },
      { id: '4', type: 'face', date: '2023-10-10', title: 'Análisis Facial', detail: 'Simetría 92% • Piel: Excelente', icon: 'Scan' },
      { id: '5', type: 'steps', date: '2023-10-10', title: 'Actividad Diaria', detail: '12,432 pasos • 8.2 km', icon: 'Footprints' },
    ];
  });

  const filteredItems = activeFilter === 'all' 
    ? historyItems 
    : historyItems.filter(item => item.type === activeFilter);

  const clearHistory = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todo el historial?')) {
      setHistoryItems([]);
      localStorage.removeItem('vitalis_history');
      toast.success('Historial borrado');
    }
  };

  const deleteItem = (id: string) => {
    const newItems = historyItems.filter(item => item.id !== id);
    setHistoryItems(newItems);
    localStorage.setItem('vitalis_history', JSON.stringify(newItems));
    toast.info('Registro eliminado');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase italic">Historial</h1>
          <p className="text-white/50 text-sm">Tu evolución centralizada.</p>
        </div>
        <button className="bg-zinc-900 p-3 rounded-2xl border border-white/5 text-white/40 hover:text-white transition-colors">
          <Download size={20} />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex items-center justify-center gap-2 hover:bg-white/[0.02] transition-all">
          <FileText size={18} className="text-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Exportar PDF</span>
        </button>
        <button className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex items-center justify-center gap-2 hover:bg-white/[0.02] transition-all">
          <Globe size={18} className="text-purple-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Comunidad</span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all",
              activeFilter === filter.id ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-zinc-900 text-white/40 border border-white/5"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 p-5 rounded-3xl border border-white/5 flex items-center gap-4 group hover:border-orange-500/30 transition-all"
            >
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-all">
                <Calendar size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{item.date}</span>
                </div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">{item.detail}</p>
              </div>
              <button 
                onClick={() => deleteItem(item.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="p-20 text-center">
            <HistoryIcon size={48} className="text-white/5 mx-auto mb-4" />
            <p className="text-xs text-white/20 uppercase tracking-widest italic">No hay registros para este filtro</p>
          </div>
        )}
      </div>

      <div className="mt-12 p-6 bg-zinc-900 rounded-[40px] border border-white/5 text-center">
        <h3 className="text-lg font-bold uppercase italic tracking-wider mb-2">Resumen de Progreso</h3>
        <p className="text-xs text-white/40 mb-6">Has completado el 85% de tus objetivos este mes.</p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-black px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <Share2 size={14} />
            Compartir Logros
          </button>
          <button 
            onClick={clearHistory}
            className="bg-zinc-800 text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <Trash2 size={14} className="text-red-500" />
            Borrar Todo
          </button>
        </div>
      </div>
    </div>
  );
}
