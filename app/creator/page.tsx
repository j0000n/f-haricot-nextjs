"use client";

import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@haricot/convex-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "@/i18n/useTranslation";

type Profile = {
  name?: string | null;
  email?: string | null;
  userType?: string | null;
};

type ProfileRow = {
  label: string;
  value: string;
};

export default function CreatorPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser) as Profile | null | undefined;
  const router = useRouter();
  const userType = user?.userType ?? "";

  useEffect(() => {
    if (user === undefined) {
      return;
    }

    if (userType !== "creator") {
      router.replace("/");
    }
  }, [router, user, userType]);

  if (isLoading || user === undefined) {
    return (
      <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <p>{t("common.loading")}</p>
      </main>
    );
  }

  if (!isAuthenticated || userType !== "creator" || !user) {
    return null;
  }

  const profileRows: ProfileRow[] = [
    {
      label: t("creator.nameLabel"),
      value: user.name ? String(user.name) : t("creator.missingField"),
    },
    {
      label: t("creator.emailLabel"),
      value: user.email ? String(user.email) : t("creator.missingField"),
    },
    {
      label: t("creator.userTypeLabel"),
      value: userType || t("creator.missingField"),
    },
  ];

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>{t("creator.title")}</h1>
      
      <div
        style={{
          display: "inline-block",
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "white",
          borderRadius: "4px",
          marginBottom: "1.5rem",
        }}
      >
        {t("creator.badge")}
      </div>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "1.5rem",
          borderRadius: "8px",
          marginTop: "1rem",
        }}
      >
        <h2 style={{ marginTop: 0 }}>{t("creator.profileHeading")}</h2>
        <p style={{ color: "#666" }}>{t("creator.description")}</p>

        <div style={{ marginTop: "1.5rem" }}>
          {profileRows.map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.75rem 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              <span style={{ fontWeight: "bold" }}>{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
