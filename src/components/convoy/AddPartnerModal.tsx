import { useState } from 'react';
import { UserPlus, Mail, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePartnerStore } from '@/stores/partnerStore';
import { toast } from 'sonner';
import { z } from 'zod';

const partnerFormSchema = z.object({
  name: z.string().trim().min(1, 'Please enter a name').max(100, 'Name is too long'),
  email: z.string().trim().email('Please enter a valid email address').max(255, 'Email is too long'),
});

interface AddPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPartnerModal({ open, onOpenChange }: AddPartnerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPartner, partners } = usePartnerStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate with Zod
    const result = partnerFormSchema.safeParse({ name, email });
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    const validatedData = result.data;

    // Check if email already exists
    if (partners.some(p => p.email.toLowerCase() === validatedData.email.toLowerCase())) {
      toast.error('A partner with this email already exists');
      return;
    }

    setIsSubmitting(true);

    // Add partner to store
    addPartner({
      name: validatedData.name,
      email: validatedData.email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(validatedData.name)}`,
    });

    toast.success(`${validatedData.name} has been added as an accountability partner`);
    
    setName('');
    setEmail('');
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Add Accountability Partner
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="partner-name" className="text-sm font-medium">
              Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="partner-name"
                type="text"
                placeholder="Enter partner's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner-email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="partner-email"
                type="email"
                placeholder="partner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              We'll use this email to send notifications based on your rules
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Partner'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
