import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Utensils, Plus, ChevronRight, Flame, Beef, Wheat, Droplets, Sparkles, ShoppingCart, Pill, Trash2 } from 'lucide-react';
import { analyzeFood } from '../lib/gemini';
import { FoodEntry } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const mealTypes = [
  { id: 'breakfast', label: 'Desayuno', icon: <Utensils size={16} /> },
  { id: 'lunch', label: 'Almuerzo', icon: <Utensils size={16} /> },
  { id: 'dinner', label: 'Cena', icon: <Utensils size={16} /> },
  { id: 'snack', label: 'Snacks', icon: <Utensils size={16} /> },
];

export function Nutrition() {
  const [entries, setEntries] = useState<FoodEntry[]>(() => {
    const saved = localStorage.getItem('vitalis_nutrition');
    return saved ? JSON.parse(saved) : [];
  });
  const [isScanning, setIsScanning] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string>('breakfast');

  useEffect(() => {
    localStorage.setItem('vitalis_nutrition', JSON.stringify(entries));
  }, [entries]);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const mockImage = "data:image/jpeg;base64,...";
      const result = await analyzeFood(mockImage);
      const newEntry: FoodEntry = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        mealType: selectedMealType as any,
        name: result.name || 'Comida Detectada',
        calories: result.calories || 0,
        macros: result.macros || { protein: 0, carbs: 0, fat: 0 }
      };
      setEntries([newEntry, ...entries]);
      toast.success(`Registrado en ${mealTypes.find(m => m.id === selectedMealType)?.label}`);
    } catch (error) {
      console.error(error);
      toast.error("Error al analizar la comida");
    } finally {
      setIsScanning(false);
    }
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    toast.info("Registro eliminado");
  };

  const totalCalories = entries.reduce((acc, curr) => acc + curr.calories, 0);
  const totalMacros = entries.reduce((acc, curr) => ({
    protein: acc.protein + curr.macros.protein,
    carbs: acc.carbs + curr.macros.carbs,
    fat: acc.fat + curr.macros.fat
  }), { protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tighter uppercase italic">Nutrición</h1>
        <p className="text-white/50 text-sm">Combustible para tu máximo rendimiento.</p>
      </header>

      <div className="bg-zinc-900 p-6 rounded-3xl border border-white/5 mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Calorías Totales</span>
            <span className="text-5xl font-bold tracking-tighter text-orange-500">{totalCalories}</span>
            <span className="text-white/40 text-sm ml-2">/ 2,500 kcal</span>
          </div>
          <div className="flex gap-2">
            <MacroBadge label="P" value={totalMacros.protein} color="bg-red-500" />
            <MacroBadge label="C" value={totalMacros.carbs} color="bg-blue-500" />
            <MacroBadge label="G" value={totalMacros.fat} color="bg-yellow-500" />
          </div>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalCalories / 2500) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-8">
        {mealTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedMealType(type.id)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
              selectedMealType === type.id
                ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "bg-zinc-900 border-white/5 text-white/40"
            )}
          >
            {type.icon}
            <span className="text-[10px] font-bold uppercase tracking-widest">{type.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 hover:bg-orange-500/10 transition-all group disabled:opacity-50"
        >
          <Camera className={cn("text-orange-500 group-hover:scale-110 transition-transform", isScanning && "animate-pulse")} size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{isScanning ? 'Analizando...' : 'Escanear Plato'}</span>
        </button>
        <button className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 hover:bg-orange-500/10 transition-all group">
          <Plus className="text-orange-500 group-hover:scale-110 transition-transform" size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Añadir Manual</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex items-center gap-3 hover:bg-white/[0.02] transition-all">
          <ShoppingCart size={18} className="text-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Lista Compra</span>
        </button>
        <button className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex items-center gap-3 hover:bg-white/[0.02] transition-all">
          <Pill size={18} className="text-purple-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Suplementos</span>
        </button>
      </div>

      <div className="space-y-6">
        {mealTypes.map((meal) => (
          <div key={meal.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                {meal.icon}
                {meal.label}
              </h3>
              <span className="text-[10px] font-bold text-white/20">
                {entries.filter(e => e.mealType === meal.id).reduce((acc, curr) => acc + curr.calories, 0)} kcal
              </span>
            </div>
            
            <div className="space-y-2">
              {entries.filter(e => e.mealType === meal.id).map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-sm">{entry.name}</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">
                      P: {entry.macros.protein}g • C: {entry.macros.carbs}g • G: {entry.macros.fat}g
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-bold text-orange-500 block">{entry.calories} kcal</span>
                      <button 
                        onClick={() => removeEntry(entry.id)}
                        className="text-[10px] text-white/20 hover:text-red-500 uppercase tracking-widest font-bold"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {entries.filter(e => e.mealType === meal.id).length === 0 && (
                <div className="p-4 rounded-2xl border border-dashed border-white/5 text-center">
                  <p className="text-[10px] text-white/20 uppercase tracking-widest italic">Sin registros</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-8 w-full bg-orange-500 p-4 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
      >
        <Sparkles size={18} />
        Generar Receta IA
      </motion.button>
    </div>
  );
}

function MacroBadge({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white mb-1", color)}>
        {label}
      </div>
      <span className="text-[10px] font-bold">{value}g</span>
    </div>
  );
}
