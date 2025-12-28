import { NavLink } from '@/components/NavLink';
import { Users, Eye, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import dreamakerLogo from '@/assets/dreamaker-logo.png';

const navItems = [
  { to: '/convoy', label: 'Convoy', icon: Users },
  { to: '/', label: 'Vision', icon: Eye },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
];

export function Navigation() {
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={dreamakerLogo} 
              alt="Dreamaker" 
              className="w-8 h-8 rounded-lg"
            />
            <span className="font-display text-xl font-semibold text-foreground">Dreamaker</span>
          </div>
          
          <div className="flex items-center gap-1 bg-muted rounded-full p-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium",
                  "text-muted-foreground transition-all duration-200",
                  "hover:text-foreground"
                )}
                activeClassName="bg-primary text-primary-foreground shadow-md hover:text-primary-foreground"
                end={item.to === '/'}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
          
          <div className="w-32" /> {/* Spacer for balance */}
        </div>
      </nav>
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-card/95 backdrop-blur-sm border-t border-border z-50 pb-safe">
        <div className="flex items-center justify-around h-full px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl",
                "text-muted-foreground transition-all duration-200",
                "hover:text-foreground"
              )}
              activeClassName="text-primary"
              end={item.to === '/'}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
