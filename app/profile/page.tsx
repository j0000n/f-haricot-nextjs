"use client";

import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@haricot/convex-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useTranslation } from "@/i18n/useTranslation";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <p>{t("common.loading")}</p>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>{t("profile.title")}</h1>
      <LanguageSwitcher />
      <div style={{ marginTop: "2rem" }}>
        <h2>{t("profile.userData")}</h2>
        <pre style={{ background: "#f5f5f5", padding: "1rem", overflow: "auto" }}>
          <code>{JSON.stringify(user, null, 2)}</code>
        </pre>
      </div>
    </main>
  );
}
