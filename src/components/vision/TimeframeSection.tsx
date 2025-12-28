import { Dream, TimeFrame, Domain, TIMEFRAMES, DOMAINS } from '@/types/dream';
import { DomainColumn } from './DomainColumn';
import { useDreamStore } from '@/stores/dreamStore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TimeframeSectionProps {
  timeFrame: TimeFrame;
  onAddDream: (timeFrame: TimeFrame, domain: Domain) => void;
  onDreamClick: (dream: Dream) => void;
}

export function TimeframeSection({ 
  timeFrame, 
  onAddDream, 
  onDreamClick 
}: TimeframeSectionProps) {
  const timeframeInfo = TIMEFRAMES.find(t => t.key === timeFrame);
  const { dreams } = useDreamStore();
  
  const getDreamsForCell = (domain: Domain) => {
    return dreams.filter(d => d.timeFrame === timeFrame && d.domain === domain);
  };
  
  const totalDreams = dreams.filter(d => d.timeFrame === timeFrame).length;

  return (
    <Accordion type="single" collapsible defaultValue={timeFrame === 'short' ? timeFrame : undefined} className="w-full">
      <AccordionItem value={timeFrame} className="border-none">
        <AccordionTrigger className="py-4 px-2 hover:no-underline group">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-semibold text-foreground">
                {timeframeInfo?.label}
              </h2>
              <span className="text-sm text-muted-foreground">
                {timeframeInfo?.description}
              </span>
            </div>
            {totalDreams > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {totalDreams} {totalDreams === 1 ? 'dream' : 'dreams'}
              </span>
            )}
          </div>
        </AccordionTrigger>
        
        <AccordionContent className="pb-8 pt-2">
          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
            <div className="inline-flex gap-4" style={{ minWidth: 'max-content' }}>
              {DOMAINS.map((domain) => (
                <div key={domain.key} className="w-[180px] flex-shrink-0">
                  <DomainColumn
                    domain={domain.key}
                    timeFrame={timeFrame}
                    dreams={getDreamsForCell(domain.key)}
                    onAddDream={onAddDream}
                    onDreamClick={onDreamClick}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop: Fixed Grid with equal columns */}
          <div className="hidden md:grid grid-cols-6 gap-5">
            {DOMAINS.map((domain) => (
              <div key={domain.key} className="min-w-0">
                <DomainColumn
                  domain={domain.key}
                  timeFrame={timeFrame}
                  dreams={getDreamsForCell(domain.key)}
                  onAddDream={onAddDream}
                  onDreamClick={onDreamClick}
                />
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

