"use client";

import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@haricot/convex-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import Link from "next/link";

export default function ListsPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const lists = useQuery(api.lists.getAll);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || lists === undefined) {
    return (
      <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <p>{t("common.loading")}</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Debug: log lists to console
  if (typeof window !== "undefined") {
    console.log("Lists query result:", lists);
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>{t("lists.title")}</h1>
      
      {lists.length === 0 ? (
        <div>
          <p>{t("lists.emptyState")}</p>
          <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
            Note: Lists need to be created and stored in Convex. The React Native app currently stores lists locally.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
          {lists.map((list) => (
            <Link
              key={list._id}
              href={`/list/${list._id}`}
              style={{
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {list.emoji && <span style={{ fontSize: "1.5rem" }}>{list.emoji}</span>}
                <div>
                  <h2 style={{ margin: 0 }}>{list.name}</h2>
                  <p style={{ margin: "0.5rem 0 0 0", color: "#666", fontSize: "0.9rem" }}>
                    {(() => {
                      const count =
                        list.type === "cook-asap"
                          ? list.entries?.length ?? 0
                          : list.recipeIds?.length ?? 0;
                      return count === 0
                        ? t("lists.emptyList")
                        : count === 1
                        ? t("lists.itemsWithCount_one", { count })
                        : t("lists.itemsWithCount_other", { count });
                    })()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
