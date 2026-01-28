import { motion } from 'framer-motion';
import { Navigation, Radio, Heart, Lock } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'nav', label: 'NAV', icon: Navigation, subtitle: 'Neural Navigation' },
  { id: 'intel', label: 'INTEL', icon: Radio, subtitle: 'Acoustic Shield' },
  { id: 'bio', label: 'BIO', icon: Heart, subtitle: 'Predictive Vitals' },
  { id: 'secure', label: 'SECURE', icon: Lock, subtitle: 'Ghost Mesh' },
];

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <nav className="glass-panel border-b border-border">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 py-3 px-4 transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 border-b-2 border-primary' 
                  : 'hover:bg-primary/5 border-b-2 border-transparent'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/5"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              <div className="relative flex items-center justify-center gap-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary glow-text' : 'text-muted-foreground'}`} />
                <div className="text-left">
                  <p className={`text-xs font-medium tracking-widest ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {tab.label}
                  </p>
                  <p className="text-[8px] text-muted-foreground/60 tracking-wider hidden sm:block">
                    {tab.subtitle}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
