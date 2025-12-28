import { Plus } from 'lucide-react';
import { TimeFrame, Domain } from '@/types/dream';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AddDreamButtonProps {
  timeFrame: TimeFrame;
  domain: Domain;
  onClick: () => void;
}

export function AddDreamButton({ onClick }: AddDreamButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full h-24 rounded-xl border-2 border-dashed border-border",
        "flex flex-col items-center justify-center gap-2",
        "text-muted-foreground transition-all duration-200",
        "hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
        "group"
      )}
    >
      <div className="w-8 h-8 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
        <Plus className="w-4 h-4" />
      </div>
      <span className="text-xs font-medium">Add Dream</span>
    </motion.button>
  );
}

