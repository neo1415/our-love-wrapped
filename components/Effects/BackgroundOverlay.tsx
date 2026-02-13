'use client';

export default function BackgroundOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <img
        src="/background/WhatsApp Image 2026-02-09 at 4.26.48 PM.jpeg"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          filter: 'brightness(0.3)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/70 via-dark-bg/70 to-dark-bg/70" />
    </div>
  );
}
