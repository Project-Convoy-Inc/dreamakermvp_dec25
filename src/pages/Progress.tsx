import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Trophy, 
  Target, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Check,
  Circle,
  ArrowRight,
  Zap,
  Users,
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDreamStore } from '@/stores/dreamStore';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSupabaseJournal } from '@/hooks/useSupabaseJournal';
import { getCategoryInfo, JournalCategory } from '@/types/journal';
import { format, isToday, isYesterday } from 'date-fns';

type TimePeriod = 'week' | 'month' | 'ytd';

// Mock data - in real app would be calculated from actual data
const getKPIsByPeriod = (period: TimePeriod) => {
  const data = {
    week: { actionsTaken: 8, dreamsCreated: 1, groupDiscussions: 2 },
    month: { actionsTaken: 32, dreamsCreated: 4, groupDiscussions: 8 },
    ytd: { actionsTaken: 156, dreamsCreated: 12, groupDiscussions: 45 },
  };
  return data[period];
};

const getAISummaryByPeriod = (period: TimePeriod) => {
  const summaries = {
    week: {
      dateRange: 'Nov 30 – Dec 6, 2024',
      content: "Strong week! You've taken 8 actions and attended 2 group discussions. Your focus on Finance is paying off—you're 5% closer to your emergency fund goal. Keep the momentum going!",
    },
    month: {
      dateRange: 'Nov 1 – Dec 6, 2024',
      content: "Great momentum this month! You've completed 32 actions across 4 dreams. Your strongest domain is Finance, where you've hit 60% of your emergency fund goal. Consider focusing on Health & Wellness next week.",
    },
    ytd: {
      dateRange: 'Jan 1 – Dec 6, 2024',
      content: "What a year! You've taken 156 actions, created 12 dreams, and attended 45 group discussions. Your most active domains are Career and Finance. You've completed 3 major milestones and built a strong foundation for next year.",
    },
  };
  return summaries[period];
};

const formatDateGroup = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export default function ProgressPage() {
  const { dreams } = useDreamStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  
  const { entries } = useSupabaseJournal();
  
  const totalSteps = dreams.reduce((acc, d) => acc + d.steps.length, 0);
  const completedSteps = dreams.reduce((acc, d) => acc + d.steps.filter(s => s.completed).length, 0);
  
  const kpis = getKPIsByPeriod(timePeriod);
  const aiSummary = getAISummaryByPeriod(timePeriod);
  
  // Get upcoming steps
  const upcomingSteps = dreams
    .flatMap(dream => dream.steps
      .filter(step => !step.completed)
      .map(step => ({ ...step, dreamTitle: dream.title, domain: dream.domain }))
    )
    .slice(0, 5);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const periodLabels: Record<TimePeriod, string> = {
    week: 'This Week',
    month: 'This Month',
    ytd: 'Year to Date',
  };

  // Group journal entries by date
  const groupedEntries = entries.reduce((groups, entry) => {
    const dateKey = formatDateGroup(entry.createdAt);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(entry);
    return groups;
  }, {} as Record<string, typeof entries>);

  const getDreamTitleById = (dreamId?: string) => {
    if (!dreamId) return undefined;
    return dreams.find(d => d.id === dreamId)?.title;
  };
  
  return (
    <>
      <Helmet>
        <title>Progress | Dreamaker</title>
        <meta name="description" content="Track your progress towards your dreams. View reflections, streaks, and upcoming milestones." />
      </Helmet>
      
      <div className="min-h-screen space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Progress
            </h1>
            <p className="text-muted-foreground">
              Your journey at a glance
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              <Check className="w-3 h-3" />
              {completedSteps} Completed
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Circle className="w-3 h-3" />
              {totalSteps - completedSteps} Remaining
            </Badge>
          </div>
        </motion.div>

        {/* Time Period Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex gap-2"
        >
          {(['week', 'month', 'ytd'] as TimePeriod[]).map((period) => (
            <Button
              key={period}
              variant={timePeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimePeriod(period)}
            >
              {periodLabels[period]}
            </Button>
          ))}
        </motion.div>

        {/* KPIs Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{kpis.actionsTaken}</div>
                  <div className="text-sm text-muted-foreground">Actions Taken</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{kpis.dreamsCreated}</div>
                  <div className="text-sm text-muted-foreground">Dreams Created</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{kpis.groupDiscussions}</div>
                  <div className="text-sm text-muted-foreground">Group Discussions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Summary Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-primary/5 via-card to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mt-1">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        AI Summary
                      </h3>
                      <Badge className="bg-primary/20 text-primary border-0">{periodLabels[timePeriod]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{aiSummary.dateRange}</p>
                    <p className="text-foreground">{aiSummary.content}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  ✕
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Calendar View */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === new Date().getDate() && 
                      currentMonth.getMonth() === new Date().getMonth() &&
                      currentMonth.getFullYear() === new Date().getFullYear();
                    const hasActivity = [5, 8, 12, 15, 18, 20, 24].includes(day);
                    
                    return (
                      <button
                        key={day}
                        className={cn(
                          "aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm transition-colors",
                          isToday ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted",
                          !isToday && hasActivity && "font-medium"
                        )}
                      >
                        {day}
                        {hasActivity && !isToday && (
                          <div className="w-1 h-1 rounded-full bg-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Upcoming Steps */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-secondary" />
                  Upcoming Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingSteps.length > 0 ? (
                  upcomingSteps.map((step) => (
                    <div
                      key={step.id}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                    >
                      <p className="text-sm font-medium text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{step.dreamTitle}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No upcoming steps. Add some to your dreams!
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.section>
        </div>

        {/* Journal */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg">Journal</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.keys(groupedEntries).length > 0 ? (
                Object.entries(groupedEntries).map(([date, dateEntries]) => (
                  <div key={date}>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">{date}</h4>
                    <div className="space-y-3">
                      {dateEntries.map((entry) => {
                        const categoryInfo = getCategoryInfo(entry.category);
                        const linkedDream = getDreamTitleById(entry.dreamId);
                        
                        return (
                          <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-lg">
                              {categoryInfo.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-foreground">{entry.title}</p>
                                <Badge variant="secondary" className="text-xs">
                                  {categoryInfo.label}
                                </Badge>
                              </div>
                              {entry.content && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {entry.content}
                                </p>
                              )}
                              {linkedDream && (
                                <p className="text-xs text-primary mt-1">
                                  Linked to: {linkedDream}
                                </p>
                              )}
                              {entry.imageUrl && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                  <ImageIcon className="w-3 h-3" />
                                  <span>Has media</span>
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {formatTime(entry.createdAt)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No journal entries yet.</p>
                  <p className="text-sm mt-1">Start capturing your journey by adding an entry!</p>
                </div>
              )}
              
              {Object.keys(groupedEntries).length > 0 && (
                <Button variant="outline" className="w-full">
                  Load More
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </>
  );
}
