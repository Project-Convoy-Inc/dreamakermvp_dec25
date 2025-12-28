import { useState } from 'react';
import { Dream, TimeFrame, Domain, TIMEFRAMES } from '@/types/dream';
import { useDreamStore } from '@/stores/dreamStore';
import { TimeframeSection } from './TimeframeSection';
import { CreateDreamModal } from './CreateDreamModal';
import { DreamModal } from './DreamModal';
import { motion } from 'framer-motion';

export function VisionBoard() {
  const { getDreamById } = useDreamStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [dreamModalOpen, setDreamModalOpen] = useState(false);
  const [createContext, setCreateContext] = useState<{
    timeFrame: TimeFrame;
    domain: Domain;
  }>({ timeFrame: 'short', domain: 'work' });

  const handleAddDream = (timeFrame: TimeFrame, domain: Domain) => {
    setCreateContext({ timeFrame, domain });
    setCreateModalOpen(true);
  };

  const handleDreamClick = (dream: Dream) => {
    setSelectedDream(dream);
    setDreamModalOpen(true);
  };

  const handleDreamCreated = (dreamId: string) => {
    // Open the dream modal after creation to show AI-generated content
    const dream = getDreamById(dreamId);
    if (dream) {
      setSelectedDream(dream);
      setDreamModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Vision Board
        </h1>
        <p className="text-muted-foreground">
          Map your dreams across life domains and timelines
        </p>
      </motion.div>

      {/* Timeframe Sections */}
      <div className="space-y-2">
        {TIMEFRAMES.map((tf, index) => (
          <motion.div
            key={tf.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TimeframeSection
              timeFrame={tf.key}
              onAddDream={handleAddDream}
              onDreamClick={handleDreamClick}
            />
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      <CreateDreamModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        initialTimeFrame={createContext.timeFrame}
        initialDomain={createContext.domain}
        onDreamCreated={handleDreamCreated}
      />
      
      <DreamModal
        dream={selectedDream}
        open={dreamModalOpen}
        onOpenChange={setDreamModalOpen}
      />
    </div>
  );
}

