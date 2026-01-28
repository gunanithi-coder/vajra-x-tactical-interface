import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TacticalProvider, useTactical } from '@/contexts/TacticalContext';
import { Header } from '@/components/tactical/Header';
import { TabNavigation } from '@/components/tactical/TabNavigation';
import { NavTab } from '@/components/tactical/NavTab';
import { IntelTab } from '@/components/tactical/IntelTab';
import { BioTab } from '@/components/tactical/BioTab';
import { SecureTab } from '@/components/tactical/SecureTab';
import { HighStressOverlay } from '@/components/tactical/HighStressOverlay';

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('nav');
  const { systemMode } = useTactical();

  const renderTab = () => {
    switch (activeTab) {
      case 'nav':
        return <NavTab />;
      case 'intel':
        return <IntelTab />;
      case 'bio':
        return <BioTab />;
      case 'secure':
        return <SecureTab />;
      default:
        return <NavTab />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col tactical-grid ${
      systemMode === 'stealth' ? 'stealth-mode' : ''
    } ${systemMode === 'high-stress' ? 'high-stress-mode' : ''}`}>
      {/* CRT Scanline Overlay */}
      <div className="crt-overlay" />
      
      {/* High Stress Extraction Overlay */}
      <HighStressOverlay />
      
      {/* Header */}
      <Header />
      
      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Footer Status Bar */}
      <footer className="glass-panel border-t border-border px-4 py-2">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>VAJRA-X v2.1.4 | ENCRYPTION: AES-256</span>
          <span>MESH: 4 NODES | BATTERY: 87%</span>
          <span className="text-primary">OPERATIONAL</span>
        </div>
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <TacticalProvider>
      <DashboardContent />
    </TacticalProvider>
  );
};

export default Index;
