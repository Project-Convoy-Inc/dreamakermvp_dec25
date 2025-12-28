import { MoreVertical, Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface OnboardingMenuProps {
  onSaveAndExit: () => void;
}

export function OnboardingMenu({ onSaveAndExit }: OnboardingMenuProps) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OnboardingMenu.tsx:16',message:'OnboardingMenu render',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  const navigate = useNavigate();

  const handleLogout = () => {
    // For now, just navigate to home since there's no auth
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onSaveAndExit}>
          <Save className="mr-2 h-4 w-4" />
          Save & Exit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
