import { VisionBoard } from '@/components/vision/VisionBoard';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { Helmet } from 'react-helmet-async';

export default function Vision() {
  const handleRefresh = async () => {
    // Reload vision board data
    await new Promise(resolve => setTimeout(resolve, 800));
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <title>Vision Board | Dreamaker</title>
        <meta name="description" content="Organize your dreams across life domains and timelines. Track your progress towards short-term, mid-term, and long-term goals." />
      </Helmet>
      <PullToRefresh onRefresh={handleRefresh}>
        <VisionBoard />
      </PullToRefresh>
    </>
  );
}
