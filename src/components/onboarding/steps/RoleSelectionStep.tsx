import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserRole } from '@/stores/userStore';
import { User, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleSelectionStepProps {
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
  onNext: () => void;
  onBack?: () => void;
}

const ROLES = [
  {
    id: 'user' as UserRole,
    title: 'Individual User',
    description: 'Track your personal dreams and goals',
    icon: User,
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Create and track personal dreams',
      'Access to Sidekick AI assistant',
      'Progress tracking and journaling',
      'Personal vision board',
    ],
  },
  {
    id: 'partner' as UserRole,
    title: 'Dream Partner',
    description: 'Support others in achieving their dreams',
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    features: [
      'Collaborate on shared dreams',
      'Support accountability partners',
      'View partner progress updates',
      'Shared celebration milestones',
    ],
  },
  {
    id: 'admin' as UserRole,
    title: 'Administrator',
    description: 'Manage platform and user permissions',
    icon: Shield,
    color: 'from-orange-500 to-red-500',
    features: [
      'Full platform access',
      'User management capabilities',
      'Analytics and insights',
      'Content moderation tools',
    ],
  },
];

export function RoleSelectionStep({
  selectedRole,
  onSelectRole,
  onNext,
  onBack,
}: RoleSelectionStepProps) {
  const canProceed = selectedRole !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container max-w-4xl mx-auto px-4 py-8 md:py-16 space-y-8"
    >
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Choose Your Role
          </h1>
        </motion.div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select how you'd like to use Dreamaker. You can always change this later in your settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ROLES.map((role, index) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'cursor-pointer transition-all duration-300 hover:shadow-lg',
                  isSelected && 'ring-2 ring-primary shadow-lg scale-105'
                )}
                onClick={() => onSelectRole(role.id)}
              >
                <CardContent className="p-6 space-y-4">
                  <div
                    className={cn(
                      'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center',
                      role.color
                    )}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {role.features.map((feature, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="pt-2"
                    >
                      <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium text-center">
                        Selected
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-8">
        {onBack ? (
          <Button variant="outline" onClick={onBack} size="lg">
            Back
          </Button>
        ) : (
          <div />
        )}

        <Button
          onClick={onNext}
          disabled={!canProceed}
          size="lg"
          className="min-w-32"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}

