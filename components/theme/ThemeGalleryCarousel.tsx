"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ThemeName, ThemeTokens } from "@/styles/themes";
import type { CustomThemeRecord } from "@/styles/themes/customTheme";
import { ThemePhonePreview } from "./ThemePhonePreview";
import styles from "./theme.module.css";

export type GalleryThemeSource = "mine" | "builtIn" | "public";

export type GalleryThemeItem = {
  id: string;
  source: GalleryThemeSource;
  label: string;
  description: string;
  tokens: ThemeTokens;
  themeName?: ThemeName;
  shareCode?: string;
  customTheme?: CustomThemeRecord;
};

type ThemeGalleryCarouselProps = {
  items: GalleryThemeItem[];
  initialIndex?: number;
  onApplyTheme: (item: GalleryThemeItem) => Promise<void>;
};

const clampIndex = (value: number, length: number) =>
  Math.max(0, Math.min(value, Math.max(length - 1, 0)));

const getSourceLabel = (source: GalleryThemeSource) => {
  if (source === "mine") {
    return "My theme";
  }
  if (source === "public") {
    return "Public";
  }
  return "Built-in";
};

export function ThemeGalleryCarousel({
  items,
  initialIndex = 0,
  onApplyTheme,
}: ThemeGalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    clampIndex(initialIndex, items.length)
  );
  const [isApplying, setIsApplying] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setCurrentIndex(clampIndex(initialIndex, items.length));
  }, [initialIndex, items.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setCurrentIndex((prev) => clampIndex(prev - 1, items.length));
      } else if (event.key === "ArrowRight") {
        setCurrentIndex((prev) => clampIndex(prev + 1, items.length));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items.length]);

  const currentItem = items[currentIndex];

  const dotIndices = useMemo(() => {
    if (items.length <= 12) {
      return items.map((_, index) => index);
    }
    const start = clampIndex(currentIndex - 5, items.length);
    const end = clampIndex(start + 11, items.length);
    return Array.from({ length: end - start + 1 }, (_, offset) => start + offset);
  }, [currentIndex, items]);

  const handleApply = async () => {
    if (!currentItem) {
      return;
    }

    try {
      setIsApplying(true);
      await onApplyTheme(currentItem);
    } finally {
      setIsApplying(false);
    }
  };

  if (!currentItem) {
    return (
      <div className={styles.notice}>
        No themes available for gallery preview yet.
      </div>
    );
  }

  const chromeTokens = currentItem.tokens;

  return (
    <section className={styles.galleryRoot}>
      <div
        className={styles.galleryViewport}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) {
            return;
          }
          const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
          const delta = endX - touchStartX.current;
          if (delta >= 50) {
            setCurrentIndex((prev) => clampIndex(prev - 1, items.length));
          } else if (delta <= -50) {
            setCurrentIndex((prev) => clampIndex(prev + 1, items.length));
          }
          touchStartX.current = null;
        }}
      >
        <ThemePhonePreview
          tokens={currentItem.tokens}
          label={currentItem.label}
          subtitle={currentItem.description}
          showChrome
        />
      </div>

      <div className={styles.galleryMeta}>
        <div>
          <div
            className={styles.galleryTitle}
            style={{ color: chromeTokens.colors.textPrimary }}
          >
            {currentItem.label}
          </div>
          <div
            className={styles.galleryDescription}
            style={{ color: chromeTokens.colors.textSecondary }}
          >
            {currentItem.description}
          </div>
        </div>
        <div
          className={styles.galleryBadge}
          style={{
            borderColor: chromeTokens.colors.border,
            color: chromeTokens.colors.textSecondary,
            backgroundColor: chromeTokens.colors.surfaceSubdued,
          }}
        >
          {getSourceLabel(currentItem.source)}
        </div>
      </div>

      <div className={styles.galleryControls}>
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => clampIndex(prev - 1, items.length))}
          className={styles.galleryButton}
          disabled={currentIndex === 0}
          style={{
            borderColor: chromeTokens.colors.border,
            color: chromeTokens.colors.textPrimary,
            backgroundColor: chromeTokens.colors.surface,
          }}
        >
          Prev
        </button>

        <div className={styles.galleryDots}>
          {dotIndices.map((index) => (
            <button
              key={`gallery-dot-${index}`}
              type="button"
              aria-label={`Show theme ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              className={`${styles.galleryDot} ${
                index === currentIndex ? styles.galleryDotActive : ""
              }`}
              style={{
                backgroundColor:
                  index === currentIndex
                    ? chromeTokens.colors.accent
                    : chromeTokens.colors.textMuted,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => clampIndex(prev + 1, items.length))}
          className={styles.galleryButton}
          disabled={currentIndex >= items.length - 1}
          style={{
            borderColor: chromeTokens.colors.border,
            color: chromeTokens.colors.textPrimary,
            backgroundColor: chromeTokens.colors.surface,
          }}
        >
          Next
        </button>
      </div>

      <div className={styles.galleryFooter}>
        <div className={styles.galleryIndex}>
          {currentIndex + 1} / {items.length}
        </div>
        <button
          type="button"
          onClick={handleApply}
          disabled={isApplying}
          className={`${styles.galleryButton} ${styles.galleryApply}`}
          style={{
            backgroundColor: chromeTokens.colors.accent,
            color: chromeTokens.colors.accentOnPrimary,
          }}
        >
          {isApplying ? "Applying..." : "Apply this theme"}
        </button>
      </div>
    </section>
  );
}
