import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateScrollProgress,
  isIntentionalTap,
  isScrollDismissTrigger,
  getReaderWidthClass,
} from '@/lib/reader/reader-utils';

describe('Reader Engine — calculateScrollProgress', () => {
  it('returns 0 when scrolled to the very top', () => {
    const progress = calculateScrollProgress(0, 3000, 1000);
    assert.equal(progress, 0);
  });

  it('returns 50 when scrolled exactly halfway down the canvas', () => {
    // maxScroll = 3000 - 1000 = 2000; scrollTop = 1000 -> 50%
    const progress = calculateScrollProgress(1000, 3000, 1000);
    assert.equal(progress, 50);
  });

  it('returns 100 when scrolled to the bottom of the page', () => {
    const progress = calculateScrollProgress(2000, 3000, 1000);
    assert.equal(progress, 100);
  });

  it('clamps over-scroll bounce to 100', () => {
    const progress = calculateScrollProgress(2500, 3000, 1000);
    assert.equal(progress, 100);
  });

  it('clamps negative rubber-banding scroll to 0', () => {
    const progress = calculateScrollProgress(-100, 3000, 1000);
    assert.equal(progress, 0);
  });

  it('safely handles short chapters where scrollHeight <= clientHeight', () => {
    const progress = calculateScrollProgress(0, 800, 1000);
    assert.equal(progress, 100);
  });
});

describe('Reader Engine — isIntentionalTap (Tap vs Drag Collision)', () => {
  it('returns true for a stationary tap with 0px displacement', () => {
    assert.equal(isIntentionalTap(150, 200, 150, 200), true);
  });

  it('returns true for a natural micro-jitter tap under 8px distance', () => {
    // 3^2 + 4^2 = 25; sqrt(25) = 5px < 8px
    assert.equal(isIntentionalTap(100, 100, 103, 104), true);
  });

  it('returns false for a horizontal drag exceeding 8px threshold', () => {
    assert.equal(isIntentionalTap(100, 100, 110, 100), false);
  });

  it('returns false for a vertical scroll gesture', () => {
    assert.equal(isIntentionalTap(100, 100, 100, 150), false);
  });
});

describe('Reader Engine — isScrollDismissTrigger', () => {
  it('returns false for minor scroll nudges below 40px', () => {
    assert.equal(isScrollDismissTrigger(20), false);
    assert.equal(isScrollDismissTrigger(-25), false);
  });

  it('returns true for intentional scroll exceeding 40px threshold', () => {
    assert.equal(isScrollDismissTrigger(45), true);
    assert.equal(isScrollDismissTrigger(-50), true);
  });
});

describe('Reader Engine — getReaderWidthClass', () => {
  it('maps "full" to full max-width', () => {
    assert.equal(getReaderWidthClass('full'), 'max-w-full');
  });

  it('maps "standard" to 3xl webtoon reading column', () => {
    assert.equal(getReaderWidthClass('standard'), 'max-w-3xl');
  });

  it('maps "compact" to xl narrow reading column', () => {
    assert.equal(getReaderWidthClass('compact'), 'max-w-xl');
  });
});
