import { Dream, DOMAINS } from '@/types/dream';
import { DomainIcon } from './DomainIcon';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DreamCardProps {
  dream: Dream;
  onClick: () => void;
  isDragging?: boolean;
}

export function DreamCard({ dream, onClick, isDragging }: DreamCardProps) {
  const domainInfo = DOMAINS.find(d => d.key === dream.domain);
  const hasImage = !!dream.imageUrl;
  
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "dream-card cursor-pointer group w-full overflow-hidden",
        !hasImage && "p-3",
        isDragging && "shadow-lg ring-2 ring-primary/30"
      )}
    >
      {hasImage ? (
        /* Image Card - Square aspect ratio with hover overlay */
        <div className="relative aspect-square w-full">
          <img 
            src={dream.imageUrl} 
            alt={dream.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Hover Overlay with Info */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
            {/* Domain Badge */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <DomainIcon domain={dream.domain} size="sm" />
              <span className="text-[10px] font-medium text-muted-foreground truncate">
                {domainInfo?.label.split(' ')[0]}
              </span>
            </div>
            
            {/* Title */}
            <h3 className="font-display text-sm font-semibold text-foreground mb-1.5 line-clamp-2 leading-tight">
              {dream.title}
            </h3>
            
            {/* Description */}
            {dream.description && (
              <p className="text-[11px] text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
                {dream.description}
              </p>
            )}
            
            {/* Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{dream.progress}%</span>
              </div>
              <Progress value={dream.progress} className="h-1" />
            </div>
            
            {/* Steps indicator */}
            {dream.steps.length > 0 && (
              <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                <span>{dream.steps.filter(s => s.completed).length}</span>
                <span>/</span>
                <span>{dream.steps.length} steps</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* No Image Card - Original layout */
        <>
          {/* Domain Badge */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <DomainIcon domain={dream.domain} size="sm" />
            <span className="text-[10px] font-medium text-muted-foreground truncate">
              {domainInfo?.label.split(' ')[0]}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="font-display text-sm font-semibold text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {dream.title}
          </h3>
          
          {/* Description */}
          {dream.description && (
            <p className="text-[11px] text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
              {dream.description}
            </p>
          )}
          
          {/* Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{dream.progress}%</span>
            </div>
            <Progress value={dream.progress} className="h-1" />
          </div>
          
          {/* Steps indicator */}
          {dream.steps.length > 0 && (
            <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
              <span>{dream.steps.filter(s => s.completed).length}</span>
              <span>/</span>
              <span>{dream.steps.length} steps</span>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

