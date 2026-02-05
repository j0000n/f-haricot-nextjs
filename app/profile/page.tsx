"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@haricot/convex-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useTranslation } from "@/i18n/useTranslation";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.getCurrentUser);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
  };

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
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", minHeight: "calc(100vh - 200px)", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <h1>{t("profile.title")}</h1>
        <LanguageSwitcher />
        <div style={{ marginTop: "2rem" }}>
          <h2>{t("profile.userData")}</h2>
          <pre style={{ background: "#f5f5f5", padding: "1rem", overflow: "auto" }}>
            <code>{JSON.stringify(user, null, 2)}</code>
          </pre>
        </div>
      </div>
      <div style={{ marginTop: "auto", paddingTop: "2rem", borderTop: "1px solid #ddd" }}>
        <button
          onClick={handleSignOut}
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1rem",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {t("profile.logOut")}
        </button>
      </div>
    </main>
  );
}
