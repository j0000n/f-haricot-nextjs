import type { Recipe } from "@haricot/convex-client";

export function getRecipeLanguage(language: string): keyof Recipe["recipeName"] {
  // Map i18n language codes to recipe language codes
  const langMap: Record<string, keyof Recipe["recipeName"]> = {
    "en": "en",
    "en-US": "en",
    "en-CA": "en",
    "es": "es",
    "fr": "fr",
    "fr-FR": "fr",
    "fr-CA": "fr",
    "zh": "zh",
    "ar": "ar",
    "ja": "ja",
    "vi": "vi",
    "tl": "tl",
    "hi": "en", // Fallback to English
    "ur": "en", // Fallback to English
  };

  return langMap[language] || "en";
}
