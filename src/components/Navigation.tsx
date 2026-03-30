import { Home, Camera, Utensils, Dumbbell, User, Footprints, History, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
  { icon: Home, label: 'Inicio', path: '/' },
  { icon: Camera, label: 'Escaneos', path: '/scans' },
  { icon: Utensils, label: 'Nutrición', path: '/nutrition' },
  { icon: Dumbbell, label: 'Ejercicio', path: '/exercise' },
  { icon: Footprints, label: 'Pasos', path: '/steps' },
  { icon: Sparkles, label: 'Estilo', path: '/style' },
];

export function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-white/5 px-1 py-2 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all duration-300",
                isActive ? "text-orange-500 scale-110" : "text-white/30 hover:text-white"
              )
            }
          >
            <Icon size={18} />
            <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

