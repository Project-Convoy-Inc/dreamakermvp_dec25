import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { useUserStore, UserRole } from '@/stores/userStore';
import { toast } from 'sonner';
import dreamakerLogo from '@/assets/dreamaker-welcome-logo.png';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const setProfile = useUserStore((state) => state.setProfile);

  const handleContinue = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    setProfile({ name: name.trim(), email: email.trim(), role });
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
    >
      {/* Floating background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        <motion.img
          src={dreamakerLogo}
          alt="Dreamaker"
          className="w-48 h-48 mx-auto mb-10 rounded-3xl shadow-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Let's Build Your Vision for 2026!
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          You've already taken the first step to design the life you want and go after it.
        </p>

        <div className="max-w-sm mx-auto mb-8 space-y-4">
          <div>
            <Label htmlFor="user-name" className="text-left block mb-2 text-muted-foreground">
              What should we call you?
            </Label>
            <Input
              id="user-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center text-lg"
            />
          </div>
          <div>
            <Label htmlFor="user-email" className="text-left block mb-2 text-muted-foreground">
              What's your email?
            </Label>
            <Input
              id="user-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-center text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            />
          </div>
          <div>
            <Label htmlFor="user-role" className="text-left block mb-2 text-muted-foreground">
              Select your role
            </Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger id="user-role" className="text-lg">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button size="lg" onClick={handleContinue} className="text-lg px-8 py-6">
          Let's go
        </Button>
      </div>
    </motion.div>
  );
}