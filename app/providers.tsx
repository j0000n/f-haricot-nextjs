"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { useMemo, useEffect, useState } from "react";
import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@haricot/convex-client";
import { TranslationProvider, changeLanguage, getCurrentLanguage } from "@/i18n/useTranslation";
import { getBrowserLanguage } from "@/i18n/config";

export function Providers({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
    }
    return new ConvexReactClient(url, { unsavedChangesWarning: false });
  }, []);

  return (
    <ConvexAuthProvider client={client}>
      <TranslationProvider>
        <LanguageSync>{children}</LanguageSync>
      </TranslationProvider>
    </ConvexAuthProvider>
  );
}

// Component to sync language with user profile or browser
function LanguageSync({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser);
  const [initialized, setInitialized] = useState(false);

  // Initialize language on first mount
  useEffect(() => {
    if (initialized) return;

    if (isAuthenticated && user?.preferredLanguage) {
      // User is authenticated: use their saved preference
      const currentLang = getCurrentLanguage();
      if (user.preferredLanguage !== currentLang) {
        void changeLanguage(user.preferredLanguage);
      }
    } else if (!isAuthenticated && user === null) {
      // User is not authenticated: use browser language
      const browserLang = getBrowserLanguage();
      const currentLang = getCurrentLanguage();
      if (browserLang !== currentLang) {
        void changeLanguage(browserLang);
      }
    }

    setInitialized(true);
  }, [initialized, isAuthenticated, user]);

  // Sync with user profile when it changes (for authenticated users)
  useEffect(() => {
    if (isAuthenticated && user?.preferredLanguage && initialized) {
      const currentLang = getCurrentLanguage();
      if (user.preferredLanguage !== currentLang) {
        void changeLanguage(user.preferredLanguage);
      }
    }
  }, [isAuthenticated, user?.preferredLanguage, initialized]);

  return <>{children}</>;
}
