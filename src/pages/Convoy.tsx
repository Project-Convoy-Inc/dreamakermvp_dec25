import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { usePartnerStore } from '@/stores/partnerStore';
import { useDreamStore } from '@/stores/dreamStore';
import { AddPartnerModal } from '@/components/convoy/AddPartnerModal';
import { Partner } from '@/types/dream';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Convoy() {
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);
  const { partners, removePartner } = usePartnerStore();
  const { removePartnerFromAllDreams } = useDreamStore();

  const handleDeletePartner = () => {
    if (partnerToDelete) {
      removePartner(partnerToDelete.id);
      removePartnerFromAllDreams(partnerToDelete.id);
      toast.success(`${partnerToDelete.name} has been removed`);
      setPartnerToDelete(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Helmet>
        <title>Convoy | Dreamaker</title>
        <meta name="description" content="Connect with accountability partners and join the Dreamaker community. Get support on your journey to achieving your dreams." />
      </Helmet>
      
      <div className="min-h-screen space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Convoy
          </h1>
          <p className="text-muted-foreground">
            Your support network and community hub
          </p>
        </motion.div>

        {/* Accountability Partners */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Accountability Partners
            </h2>
          </div>
          
          <div className="flex items-center gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            <AnimatePresence mode="popLayout">
              {partners.map((partner) => (
                <motion.div
                  key={partner.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative flex flex-col items-center gap-2 min-w-[80px] group"
                >
                  <div className="relative">
                    <Avatar className="w-16 h-16 ring-2 ring-border group-hover:ring-primary transition-all">
                      <AvatarImage src={partner.avatar} alt={partner.name} />
                      <AvatarFallback>{getInitials(partner.name)}</AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => setPartnerToDelete(partner)}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive/90"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-xs font-medium text-foreground text-center whitespace-nowrap">
                    {partner.name.split(' ')[0]}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Add Partner Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 min-w-[80px]"
              onClick={() => setIsAddPartnerOpen(true)}
            >
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Add Partner</span>
            </motion.button>
          </div>
        </motion.section>

        {/* Empty State for Partners */}
        {partners.length === 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Build Your Support Network
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">
                  Add accountability partners to help you stay on track with your dreams. They'll receive updates based on your preferences.
                </p>
                <Button onClick={() => setIsAddPartnerOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Partner
                </Button>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Future Features Placeholder */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: partners.length === 0 ? 0.3 : 0.2 }}
        >
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    More Community Features Coming Soon
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    We're building community events, discussion forums, and coaching connections to help you on your journey.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      Community Events
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      Discussion Forums
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      Coach Matching
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>

      <AddPartnerModal open={isAddPartnerOpen} onOpenChange={setIsAddPartnerOpen} />

      <AlertDialog open={!!partnerToDelete} onOpenChange={(open) => !open && setPartnerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {partnerToDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove them from your accountability partners and from all dreams they're assigned to.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePartner} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
