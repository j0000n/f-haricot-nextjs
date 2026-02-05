"use client";

import { useTranslation } from "@/i18n/useTranslation";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer style={{ padding: "1rem", textAlign: "center" }}>
      <p>{t("footer.copyright")}</p>
    </footer>
  );
}
