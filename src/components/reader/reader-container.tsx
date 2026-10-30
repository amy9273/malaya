'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ChapterReaderContext } from '@/lib/mangadex/types';
import {
  calculateScrollProgress,
  isIntentionalTap,
  isScrollDismissTrigger,
  getReaderWidthClass,
  type ReaderWidthMode,
} from '@/lib/reader/reader-utils';
import { ReaderTopBar } from './reader-top-bar';
import { ReaderBottomDock } from './reader-bottom-dock';
import { ChapterDrawer } from './chapter-drawer';
import { WebtoonStrip } from './webtoon-strip';

interface ReaderContainerProps {
  context: ChapterReaderContext;
}

export function ReaderContainer({ context }: ReaderContainerProps) {
  const [isHudVisible, setIsHudVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [widthMode, setWidthMode] = useState<ReaderWidthMode>('standard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastScrollYRef = useRef(0);

  // Handle Reading Width Mode Cycling
  const cycleWidthMode = () => {
    setWidthMode((prev) => {
      if (prev === 'standard') return 'full';
      if (prev === 'full') return 'compact';
      return 'standard';
    });
  };

  // Handle Native Fullscreen API
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Graceful fallback if fullscreen is blocked by browser policy
    }
  };

  // Listen to fullscreen changes triggered by Esc key or browser UI
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Scroll Listener for Progress Calculation and Auto-Dismissal
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // 1. Update Progress Percentage
      const progress = calculateScrollProgress(
        currentScrollY,
        scrollHeight,
        clientHeight,
      );
      setScrollProgress(progress);

      // 2. Auto-Dismiss HUD if user scrolls > 40px while HUD is open
      const deltaY = currentScrollY - lastScrollYRef.current;
      if (isScrollDismissTrigger(deltaY) && !isDrawerOpen) {
        setIsHudVisible(false);
        lastScrollYRef.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDrawerOpen]);

  // Touch Gesture Handlers (Tap vs Drag Collision Prevention)
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (touch) {
      const isTap = isIntentionalTap(
        touchStartRef.current.x,
        touchStartRef.current.y,
        touch.clientX,
        touch.clientY,
      );

      // Only toggle HUD if it was an intentional tap and drawer is closed
      if (isTap && !isDrawerOpen) {
        setIsHudVisible((prev) => !prev);
      }
    }
  };

  // Desktop Mouse Click Toggle
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only toggle if not clicking interactive buttons or links
    const target = e.target as HTMLElement;
    if (!target.closest('button') && !target.closest('a') && !isDrawerOpen) {
      setIsHudVisible((prev) => !prev);
    }
  };

  const widthClass = getReaderWidthClass(widthMode);

  return (
    <main
      className="relative min-h-screen w-full bg-surface-canvas text-foreground select-none overflow-x-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleCanvasClick}
      aria-label="Webtoon Reading View"
    >
      {/* Transient Top Header */}
      <ReaderTopBar
        isVisible={isHudVisible}
        mangaId={context.mangaId}
        mangaTitle={context.mangaTitle}
        chapterNumber={context.chapter.chapterNumber}
        widthMode={widthMode}
        onCycleWidthMode={cycleWidthMode}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Webtoon Panels Canvas */}
      <WebtoonStrip
        pages={context.chapter.pages}
        chapterNumber={context.chapter.chapterNumber}
        mangaId={context.mangaId}
        nextChapter={context.nextChapter}
        widthClass={widthClass}
      />

      {/* Floating Bottom Navigation Dock */}
      <ReaderBottomDock
        isVisible={isHudVisible}
        chapterNumber={context.chapter.chapterNumber}
        scrollProgress={scrollProgress}
        prevChapter={context.prevChapter}
        nextChapter={context.nextChapter}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      {/* Quick-Jump Chapter Selection Drawer */}
      <ChapterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentChapterId={context.chapter.chapterId}
        allChapters={context.allChapters}
      />
    </main>
  );
}
