"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@haricot/convex-client";
import {
  SUPPORTED_LANGUAGES,
  changeLanguage,
  getCurrentLanguage,
  useTranslation,
  type SupportedLanguage,
} from "@/i18n/useTranslation";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);
  const [isUpdating, setIsUpdating] = useState(false);
  // Initialize with i18n's current language to ensure consistency
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Update current language when i18n language changes
  useEffect(() => {
    // Set initial language from i18n
    setCurrentLanguage(i18n.language);

    const handleLanguageChanged = () => {
      setCurrentLanguage(i18n.language);
    };

    i18n.on("languageChanged", handleLanguageChanged);
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n]);

  const handleLanguageChange = async (languageCode: SupportedLanguage) => {
    if (languageCode === currentLanguage || isUpdating) {
      return;
    }

    setIsUpdating(true);

    // Change the language in i18next immediately
    await changeLanguage(languageCode);

    setIsUpdating(false);

    // Try to persist to user profile in the background (without blocking UI)
    if (user) {
      try {
        await updateProfile({ preferredLanguage: languageCode });
      } catch (error) {
        console.error("Failed to persist language preference to backend:", error);
        // Don't show error to user since language change worked in the UI
      }
    }
  };

  const { t } = useTranslation();

  return (
    <div>
      <h2>{t("profile.language")}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {SUPPORTED_LANGUAGES.map((language) => {
          const isActive = language.code === currentLanguage;
          const isDisabled = isUpdating && !isActive;

          return (
            <button
              key={language.code}
              onClick={() => void handleLanguageChange(language.code)}
              disabled={isDisabled}
              style={{
                padding: "0.5rem 1rem",
                border: isActive ? "2px solid #0070f3" : "1px solid #ccc",
                backgroundColor: isActive ? "#f0f0f0" : "white",
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.5 : 1,
              }}
            >
              <div>{language.nativeName}</div>
              <div style={{ fontSize: "0.8rem", color: "#666" }}>{language.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
