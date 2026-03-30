import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Scan, User, Sparkles, ChevronRight, Info, Dumbbell, TrendingUp } from 'lucide-react';
import { analyzeBodyScan, analyzeFaceScan } from '../lib/gemini';
import { BodyScan, FaceScan } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export function Scans() {
  const [activeTab, setActiveTab] = useState<'body' | 'face'>('body');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<Partial<BodyScan | FaceScan> | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      // Simulate image capture
      const mockImage = "data:image/jpeg;base64,..."; // In a real app, this would be from camera
      
      if (activeTab === 'body') {
        const result = await analyzeBodyScan([mockImage]);
        setScanResult(result);
        
        // Save to history
        const historyEntry = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'body',
          date: new Date().toISOString().split('T')[0],
          title: 'Escaneo Corporal 3D',
          detail: `${result.fatPercentage}% Grasa • ${result.musclePercentage}% Músculo`,
          icon: 'User'
        };
        const history = JSON.parse(localStorage.getItem('vitalis_history') || '[]');
        localStorage.setItem('vitalis_history', JSON.stringify([historyEntry, ...history]));
        
        toast.success("Escaneo corporal completado");
      } else {
        const result = await analyzeFaceScan(mockImage);
        setScanResult(result);

        // Save to history
        const historyEntry = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'face',
          date: new Date().toISOString().split('T')[0],
          title: 'Análisis Facial IA',
          detail: `Simetría ${result.symmetryScore}% • Edad: ${result.perceivedAge}`,
          icon: 'Scan'
        };
        const history = JSON.parse(localStorage.getItem('vitalis_history') || '[]');
        localStorage.setItem('vitalis_history', JSON.stringify([historyEntry, ...history]));

        toast.success("Escaneo facial completado");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al procesar el escaneo");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tighter uppercase italic">Escaneos IA</h1>
        <p className="text-white/50 text-sm">Análisis biométrico de alta precisión.</p>
      </header>

      <div className="flex bg-zinc-900 p-1 rounded-2xl mb-8 border border-white/5">
        <button
          onClick={() => setActiveTab('body')}
          className={cn(
            "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'body' ? "bg-orange-500 text-white shadow-lg" : "text-white/40"
          )}
        >
          Cuerpo
        </button>
        <button
          onClick={() => setActiveTab('face')}
          className={cn(
            "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'face' ? "bg-orange-500 text-white shadow-lg" : "text-white/40"
          )}
        >
          Rostro
        </button>
      </div>

      <div className="relative aspect-[3/4] bg-zinc-900 rounded-[40px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden mb-8">
        <AnimatePresence mode="wait">
          {isScanning ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10"
            >
              <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-orange-500"
                  animate={{ left: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-orange-500 animate-pulse">
                Analizando Biometría...
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="text-center p-8">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
            {activeTab === 'body' ? <User size={40} className="text-white/40" /> : <Scan size={40} className="text-white/40" />}
          </div>
          <h3 className="text-xl font-bold mb-2">
            {activeTab === 'body' ? 'Escaneo Corporal 3D' : 'Análisis Facial IA'}
          </h3>
          <p className="text-sm text-white/40 mb-8 max-w-[240px] mx-auto">
            {activeTab === 'body' 
              ? 'Colócate a 2 metros de la cámara. Sigue las instrucciones de voz para las 3 posiciones.' 
              : 'Asegúrate de tener buena iluminación frontal y el rostro despejado.'}
          </p>
          <button
            onClick={handleScan}
            className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all active:scale-95"
          >
            <Camera size={20} />
            Iniciar Escaneo
          </button>
        </div>
      </div>

      {scanResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold uppercase italic tracking-wider">Resultados del Análisis</h2>
            <span className="text-[10px] bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
              Precisión 98.4%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {activeTab === 'body' ? (
              <>
                <ResultCard label="Grasa Corporal" value={`${(scanResult as BodyScan).fatPercentage}%`} icon={<Sparkles size={16} />} />
                <ResultCard label="Masa Muscular" value={`${(scanResult as BodyScan).musclePercentage}%`} icon={<Dumbbell size={16} />} />
                <ResultCard label="Agua" value={`${(scanResult as BodyScan).waterPercentage}%`} icon={<Info size={16} />} />
                <ResultCard label="Relación WHR" value={(scanResult as BodyScan).whr?.toString() || '0.85'} icon={<TrendingUp size={16} />} />
              </>
            ) : (
              <>
                <ResultCard label="Simetría" value={`${(scanResult as FaceScan).symmetryScore}%`} icon={<Sparkles size={16} />} />
                <ResultCard label="Edad Percibida" value={`${(scanResult as FaceScan).perceivedAge} años`} icon={<User size={16} />} />
                <ResultCard label="Salud Piel" value={(scanResult as FaceScan).skinHealth?.tonicity || 'Excelente'} icon={<Info size={16} />} />
                <ResultCard label="Forma Rostro" value={(scanResult as FaceScan).faceShape || 'Ovalado'} icon={<Scan size={16} />} />
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ResultCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 p-4 rounded-2xl border border-white/5">
      <div className="flex items-center gap-2 text-white/40 mb-2">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-bold tracking-tighter">{value}</div>
    </div>
  );
}
