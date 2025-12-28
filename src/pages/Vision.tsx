import { VisionBoard } from '@/components/vision/VisionBoard';
import { Helmet } from 'react-helmet-async';

export default function Vision() {
  return (
    <>
      <Helmet>
        <title>Vision Board | Dreamaker</title>
        <meta name="description" content="Organize your dreams across life domains and timelines. Track your progress towards short-term, mid-term, and long-term goals." />
      </Helmet>
      <VisionBoard />
    </>
  );
}
