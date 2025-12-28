import { Dream, TimeFrame, Domain, DOMAINS } from '@/types/dream';
import { DreamCard } from './DreamCard';
import { AddDreamButton } from './AddDreamButton';
import { DomainIcon } from './DomainIcon';
import { AnimatePresence, motion } from 'framer-motion';

interface DomainColumnProps {
  domain: Domain;
  timeFrame: TimeFrame;
  dreams: Dream[];
  onAddDream: (timeFrame: TimeFrame, domain: Domain) => void;
  onDreamClick: (dream: Dream) => void;
  showHeader?: boolean;
}

export function DomainColumn({ 
  domain, 
  timeFrame, 
  dreams, 
  onAddDream, 
  onDreamClick,
  showHeader = true 
}: DomainColumnProps) {
  const domainInfo = DOMAINS.find(d => d.key === domain);
  
  return (
    <div className="flex flex-col w-full min-w-0">
      {/* Domain Header */}
      {showHeader && (
        <div className="flex items-center gap-2 mb-3 px-1">
          <DomainIcon domain={domain} size="sm" />
          <span className="text-xs font-medium text-foreground truncate">
            {domainInfo?.label.split(' ')[0]}
          </span>
        </div>
      )}
      
      {/* Dreams List */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {dreams.map((dream) => (
            <motion.div
              key={dream.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <DreamCard 
                dream={dream} 
                onClick={() => onDreamClick(dream)} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Add Dream Button */}
        <AddDreamButton 
          timeFrame={timeFrame} 
          domain={domain} 
          onClick={() => onAddDream(timeFrame, domain)} 
        />
      </div>
    </div>
  );
}

