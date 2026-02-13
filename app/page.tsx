'use client';

import { useRouter } from 'next/navigation';
import LandingScreen from '@/components/Landing/LandingScreen';
import BackgroundOverlay from '@/components/Effects/BackgroundOverlay';

export default function Home() {
  const router = useRouter();

  const handleBegin = () => {
    // Navigate to story page
    router.push('/story');
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-dark-bg">
      {/* Background overlay effect */}
      <BackgroundOverlay />
      
      {/* Landing screen */}
      <LandingScreen onBegin={handleBegin} />
    </main>
  );
}
