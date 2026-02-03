"use client";

import { useTranslation } from "@/i18n/useTranslation";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h2>{t("welcome.title")}</h2>
      <p>{t("welcome.publicContent")}</p>
      <p>{t("welcome.loginPrompt")}</p>
    </main>
  );
}
