import { Briefcase, DollarSign, Home, Users, Heart, Infinity, Palette } from 'lucide-react';
import { Domain } from '@/types/dream';
import { cn } from '@/lib/utils';

const icons: Record<Domain, React.ComponentType<{ className?: string }>> = {
  work: Briefcase,
  wealth: DollarSign,
  family: Home,
  friends: Users,
  health: Heart,
  spirituality: Infinity,
  interests: Palette,
};

const colorClasses: Record<Domain, string> = {
  work: 'text-domain-work bg-domain-work/10',
  wealth: 'text-domain-wealth bg-domain-wealth/10',
  family: 'text-domain-family bg-domain-family/10',
  friends: 'text-domain-friends bg-domain-friends/10',
  health: 'text-domain-health bg-domain-health/10',
  spirituality: 'text-domain-spirituality bg-domain-spirituality/10',
  interests: 'text-domain-interests bg-domain-interests/10',
};

interface DomainIconProps {
  domain: Domain;
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
  className?: string;
}

export function DomainIcon({ domain, size = 'md', showBackground = true, className }: DomainIconProps) {
  const Icon = icons[domain];
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  const containerSizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  if (!showBackground) {
    return <Icon className={cn(sizeClasses[size], colorClasses[domain].split(' ')[0], className)} />;
  }

  return (
    <div className={cn('rounded-lg', containerSizes[size], colorClasses[domain], className)}>
      <Icon className={sizeClasses[size]} />
    </div>
  );
}

