'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface DownloadButtonProps {
  videoSrc: string;
  filename?: string;
}

export default function DownloadButton({ videoSrc, filename = 'our-love-story.mp4' }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = videoSrc;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show feedback
      setTimeout(() => {
        setIsDownloading(false);
      }, 2000);
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center gap-3 rounded-full bg-burgundy px-8 py-4 font-ui text-lg font-semibold text-cream shadow-lg transition-all hover:bg-burgundy/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Download video"
    >
      {isDownloading ? (
        <>
          <svg
            className="h-6 w-6 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>
          <span>Download Video</span>
        </>
      )}
    </motion.button>
  );
}
