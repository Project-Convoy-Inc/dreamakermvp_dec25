import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'sonner';
import dreamakerLogo from '@/assets/dreamaker-welcome-logo.png';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WelcomeStep.tsx:14',message:'WelcomeStep render start',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const setProfile = useUserStore((state) => state.setProfile);

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WelcomeStep.tsx:20',message:'WelcomeStep - hooks initialized',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

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
    setProfile({ name: name.trim(), email: email.trim() });
    onNext();
  };

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WelcomeStep.tsx:37',message:'WelcomeStep - about to return JSX',data:{logoPath:dreamakerLogo},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
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
        </div>

        <Button size="lg" onClick={handleContinue} className="text-lg px-8 py-6">
          Let's go
        </Button>
      </div>
    </motion.div>
  );
}