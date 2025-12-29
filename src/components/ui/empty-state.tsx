import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  children,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
          >
            <Icon className="w-8 h-8 text-primary" />
          </motion.div>
          
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            {title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            {description}
          </p>
          
          {children}
          
          {action && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={action.onClick}
                size="lg"
                className="min-h-[44px] min-w-[120px]"
              >
                {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                {action.label}
              </Button>
              
              {secondaryAction && (
                <Button
                  onClick={secondaryAction.onClick}
                  variant="outline"
                  size="lg"
                  className="min-h-[44px] min-w-[120px]"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

