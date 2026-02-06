"use client";

import { useState, useEffect, useCallback } from "react";

// Type definition for WakeLockSentinel (may not be in all TypeScript environments)
interface WakeLockSentinel extends EventTarget {
  released: boolean;
  type: "screen";
  release(): Promise<void>;
  addEventListener(
    type: "release",
    listener: (this: WakeLockSentinel, ev: Event) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: "release",
    listener: (this: WakeLockSentinel, ev: Event) => any,
    options?: boolean | EventListenerOptions
  ): void;
}

interface Navigator {
  wakeLock?: {
    request(type: "screen"): Promise<WakeLockSentinel>;
  };
}

interface UseFullscreenReturn {
  isFullscreen: boolean;
  toggleFullscreen: () => Promise<void>;
  requestFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  isSupported: boolean;
}

export function useFullscreen(): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Check if fullscreen API is supported
  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsSupported(
        !!(
          document.documentElement.requestFullscreen ||
          (document.documentElement as any).webkitRequestFullscreen ||
          (document.documentElement as any).mozRequestFullScreen ||
          (document.documentElement as any).msRequestFullscreen
        )
      );

      // Load persisted state from localStorage
      const persisted = localStorage.getItem("dashboard-fullscreen");
      if (persisted === "true") {
        setIsFullscreen(true);
      }
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
      localStorage.setItem("dashboard-fullscreen", isCurrentlyFullscreen ? "true" : "false");
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  const requestFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return;

    const element = document.documentElement;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error("Error requesting fullscreen:", error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return;

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.error("Error exiting fullscreen:", error);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await requestFullscreen();
    }
  }, [isFullscreen, requestFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    toggleFullscreen,
    requestFullscreen,
    exitFullscreen,
    isSupported,
  };
}

// Wake Lock hook
export function useWakeLock() {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
      setIsSupported(true);
    }
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (typeof navigator === "undefined" || !("wakeLock" in navigator)) {
      return;
    }

    try {
      const lock = await (navigator as any).wakeLock.request("screen");
      setWakeLock(lock);
      setIsActive(true);

      // Handle release (e.g., when user switches tabs)
      lock.addEventListener("release", () => {
        setIsActive(false);
        setWakeLock(null);
      });
    } catch (error) {
      console.error("Error requesting wake lock:", error);
      setIsActive(false);
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      try {
        await wakeLock.release();
        setWakeLock(null);
        setIsActive(false);
      } catch (error) {
        console.error("Error releasing wake lock:", error);
      }
    }
  }, [wakeLock]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wakeLock) {
        wakeLock.release().catch(console.error);
      }
    };
  }, [wakeLock]);

  return {
    isSupported,
    isActive,
    requestWakeLock,
    releaseWakeLock,
  };
}
