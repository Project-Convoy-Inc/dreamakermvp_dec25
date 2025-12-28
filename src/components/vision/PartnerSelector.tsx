import { useState } from 'react';
import { Partner } from '@/types/dream';
import { usePartnerStore } from '@/stores/partnerStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Plus, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PartnerSelectorProps {
  selectedPartners: Partner[];
  onPartnersChange: (partners: Partner[]) => void;
}

export function PartnerSelector({ selectedPartners, onPartnersChange }: PartnerSelectorProps) {
  const { partners: availablePartners } = usePartnerStore();
  const [open, setOpen] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const togglePartner = (partner: Partner) => {
    const isSelected = selectedPartners.some(p => p.id === partner.id);
    if (isSelected) {
      onPartnersChange(selectedPartners.filter(p => p.id !== partner.id));
    } else {
      onPartnersChange([...selectedPartners, partner]);
    }
  };

  const removePartner = (partnerId: string) => {
    onPartnersChange(selectedPartners.filter(p => p.id !== partnerId));
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Label */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users className="w-3.5 h-3.5" />
        <span>Partners:</span>
      </div>

      {/* Selected Partner Chips */}
      <AnimatePresence mode="popLayout">
        {selectedPartners.map((partner) => (
          <motion.div
            key={partner.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full bg-primary/10 border border-primary/20"
          >
            <Avatar className="w-5 h-5">
              <AvatarImage src={partner.avatar} alt={partner.name} />
              <AvatarFallback className="text-[8px]">{getInitials(partner.name)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-primary">{partner.name.split(' ')[0]}</span>
            <button
              onClick={() => removePartner(partner.id)}
              className="w-4 h-4 rounded-full hover:bg-primary/20 flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3 text-primary" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Partner Button */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {selectedPartners.length === 0 ? 'Add Partner' : 'Add'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2 bg-popover" align="start">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground px-2 py-1">
              Select accountability partners
            </p>
            {availablePartners.map((partner) => {
              const isSelected = selectedPartners.some(p => p.id === partner.id);
              return (
                <button
                  key={partner.id}
                  onClick={() => togglePartner(partner)}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg transition-colors",
                    isSelected 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={partner.avatar} alt={partner.name} />
                    <AvatarFallback>{getInitials(partner.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium flex-1 text-left">{partner.name}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
