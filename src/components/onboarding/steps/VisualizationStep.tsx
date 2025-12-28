import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface VisualizationStepProps {
  onNext: () => void;
}

export function VisualizationStep({ onNext }: VisualizationStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-6"
    >
      <div className="max-w-2xl w-full text-center">
        {/* Breathing circle */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-48 h-48 mx-auto mb-12 rounded-full bg-gradient-to-br from-primary/30 to-primary-glow/30 flex items-center justify-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/50 to-primary-glow/50"
          />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">
          Close your eyes and imagine
        </h1>

        <p className="text-lg text-muted-foreground mb-12">
          What does your life look like once you achieve that? Think about it for as long as you need, then come back when you're ready.
        </p>

        <Button size="lg" onClick={onNext} className="text-lg px-8">
          I'm ready
        </Button>
      </div>
    </motion.div>
  );
}
