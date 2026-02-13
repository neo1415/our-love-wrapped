'use client';

import { motion, AnimatePresence } from 'framer-motion';
import useStoryStore from '@/lib/state/storyStore';
import { loadContent } from '@/lib/content/contentLoader';

export default function ChapterMenu() {
  const { showChapterMenu, setShowChapterMenu, goToSection, currentSection } = useStoryStore();
  const content = loadContent();

  const handleChapterSelect = (sectionId: number) => {
    goToSection(sectionId, 0);
    setShowChapterMenu(false);
  };

  const handleClose = () => {
    setShowChapterMenu(false);
  };

  return (
    <AnimatePresence>
      {showChapterMenu && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-dark-bg/95 p-6 shadow-2xl backdrop-blur-md"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-title text-2xl font-bold text-cream">Chapters</h2>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-burgundy/20 text-cream transition-colors hover:bg-burgundy/40"
                aria-label="Close chapter menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            {/* Chapter list */}
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {content.sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChapterSelect(section.id)}
                  className={`w-full rounded-lg p-4 text-left transition-colors ${
                    currentSection === section.id
                      ? 'bg-burgundy text-cream'
                      : 'bg-cream/10 text-cream hover:bg-cream/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-ui text-sm font-semibold text-rose-gold">
                      {index + 1}
                    </span>
                    <span className="font-body text-lg">{section.title}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
