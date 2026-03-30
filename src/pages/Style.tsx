import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Scan, Scissors, Droplets, Sun, Moon, ChevronRight, Info, User, Brain } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const haircuts = [
  { id: 'h1', name: 'Fade Moderno', type: 'Corto', face: 'Ovalado/Cuadrado', img: 'https://picsum.photos/seed/fade/400/500' },
  { id: 'h2', name: 'Tupé Clásico', type: 'Medio', face: 'Redondo/Ovalado', img: 'https://picsum.photos/seed/pompadour/400/500' },
  { id: 'h3', name: 'Undercut Desconectado', type: 'Corto', face: 'Cuadrado/Diamante', img: 'https://picsum.photos/seed/undercut/400/500' },
  { id: 'h4', name: 'Largo Texturizado', type: 'Largo', face: 'Ovalado/Corazón', img: 'https://picsum.photos/seed/long/400/500' },
];

export function Style() {
  const [activeTab, setActiveTab] = useState<'hair' | 'skincare'>('hair');
  const [selectedHaircut, setSelectedHaircut] = useState<string | null>(null);
  const [isTryingOn, setIsTryingOn] = useState(false);

  const handleTryOn = () => {
    if (!selectedHaircut) {
      toast.error("Selecciona un corte primero");
      return;
    }
    setIsTryingOn(true);
    setTimeout(() => {
      setIsTryingOn(false);
      toast.success("Corte aplicado virtualmente");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <AnimatePresence>
        {isTryingOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-6"
          >
            <div className="relative w-full max-w-sm aspect-[3/4] bg-zinc-900 rounded-[40px] border-2 border-orange-500 overflow-hidden shadow-2xl shadow-orange-500/20">
              <img 
                src="https://picsum.photos/seed/face_user/800/1000" 
                className="w-full h-full object-cover opacity-50" 
                alt="User Face"
                referrerPolicy="no-referrer"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <img 
                  src={haircuts.find(h => h.id === selectedHaircut)?.img} 
                  className="w-full h-full object-contain mix-blend-screen" 
                  alt="Haircut Overlay"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none" />
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <div className="bg-orange-500 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                  Procesando AR...
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsTryingOn(false)}
              className="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest"
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tighter uppercase italic">Estilo & Imagen</h1>
        <p className="text-white/50 text-sm">Optimiza tu estética con IA.</p>
      </header>

      <div className="flex bg-zinc-900 p-1 rounded-2xl mb-8 border border-white/5">
        <button
          onClick={() => setActiveTab('hair')}
          className={cn(
            "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'hair' ? "bg-orange-500 text-white shadow-lg" : "text-white/40"
          )}
        >
          Cortes de Pelo
        </button>
        <button
          onClick={() => setActiveTab('skincare')}
          className={cn(
            "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'skincare' ? "bg-orange-500 text-white shadow-lg" : "text-white/40"
          )}
        >
          Skincare
        </button>
      </div>

      {activeTab === 'hair' ? (
        <div className="space-y-8">
          <div className="bg-zinc-900 p-6 rounded-3xl border border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Forma Detectada</h3>
              <p className="text-2xl font-bold tracking-tighter text-orange-500">Diamante</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
              <Scan size={24} className="text-orange-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {haircuts.map((haircut) => (
              <motion.div
                key={haircut.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedHaircut(haircut.id)}
                className={cn(
                  "relative aspect-[3/4] rounded-3xl overflow-hidden border-2 transition-all cursor-pointer",
                  selectedHaircut === haircut.id ? "border-orange-500" : "border-white/5"
                )}
              >
                <img src={haircut.img} alt={haircut.name} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                  <h4 className="font-bold text-sm leading-tight">{haircut.name}</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">{haircut.type}</p>
                </div>
                {selectedHaircut === haircut.id && (
                  <div className="absolute top-3 right-3 bg-orange-500 rounded-full p-1 shadow-lg">
                    <Sparkles size={12} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <button 
            onClick={handleTryOn}
            className="w-full bg-white text-black p-4 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all"
          >
            <Scissors size={20} />
            Probar en Realidad Aumentada
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 hover:bg-orange-500/10 transition-all group">
              <User className="text-orange-500 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Análisis Postura</span>
            </button>
            <button className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 hover:bg-orange-500/10 transition-all group">
              <Brain className="text-orange-500 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Guía Mewing</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-zinc-900 p-6 rounded-3xl border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
              <Droplets size={16} className="text-blue-500" />
              Tu Rutina Personalizada
            </h3>
            
            <div className="space-y-8">
              <div className="relative pl-8 border-l border-white/10">
                <div className="absolute -left-3 top-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Sun size={12} className="text-white" />
                </div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-4">Mañana</h4>
                <div className="space-y-3">
                  <SkincareItem label="Limpiador Suave" detail="Elimina impurezas sin resecar" />
                  <SkincareItem label="Serum Vitamina C" detail="Antioxidante y luminosidad" />
                  <SkincareItem label="Protector Solar 50+" detail="Protección UV esencial" />
                </div>
              </div>

              <div className="relative pl-8 border-l border-white/10">
                <div className="absolute -left-3 top-0 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Moon size={12} className="text-white" />
                </div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-4">Noche</h4>
                <div className="space-y-3">
                  <SkincareItem label="Limpiador en Aceite" detail="Doble limpieza profunda" />
                  <SkincareItem label="Retinol 0.5%" detail="Renovación celular nocturna" />
                  <SkincareItem label="Crema Hidratante" detail="Reparación de barrera" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-3xl border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Consejos de Looksmaxing</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-all cursor-pointer">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500">
                  <Info size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold">Guía de Mewing</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Define tu mandíbula</p>
                </div>
                <ChevronRight size={16} className="text-white/20" />
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-all cursor-pointer">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                  <Info size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold">Postura Lingual</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Mejora tu perfil facial</p>
                </div>
                <ChevronRight size={16} className="text-white/20" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SkincareItem({ label, detail }: { label: string, detail: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
      <div>
        <h5 className="text-sm font-bold">{label}</h5>
        <p className="text-[10px] text-white/40">{detail}</p>
      </div>
      <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center">
        <div className="w-2 h-2 bg-orange-500 rounded-full" />
      </div>
    </div>
  );
}
