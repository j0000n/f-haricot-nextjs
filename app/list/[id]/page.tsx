"use client";

import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { api, type Id } from "@haricot/convex-client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import Link from "next/link";

export default function ListDetailPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const params = useParams();
  const router = useRouter();
  
  const listId = useMemo<Id<"lists"> | undefined>(() => {
    const id = params.id;
    const rawId = Array.isArray(id) ? id[0] : id;
    return typeof rawId === "string" ? (rawId as Id<"lists">) : undefined;
  }, [params.id]);

  const list = useQuery(api.lists.getById, listId ? { id: listId } : "skip");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && list === null && listId) {
      // List not found or doesn't belong to user - redirect to lists page
      router.push("/lists");
    }
  }, [list, isLoading, isAuthenticated, listId, router]);

  if (isLoading || list === undefined) {
    return (
      <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <p>{t("common.loading")}</p>
      </main>
    );
  }

  if (!isAuthenticated || !list) {
    return null;
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <Link
        href="/lists"
        style={{
          display: "inline-block",
          marginBottom: "1rem",
          color: "#666",
          textDecoration: "none",
        }}
      >
        ← {t("common.back")} to Lists
      </Link>
      
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        {list.emoji && <span style={{ fontSize: "2rem" }}>{list.emoji}</span>}
        <h1 style={{ margin: 0 }}>{list.name}</h1>
      </div>

      {(() => {
        const recipeIds: Array<Id<"recipes">> =
          list.type === "cook-asap"
            ? (list.entries ?? []).map(
                (entry: { recipeId: Id<"recipes"> }) => entry.recipeId
              )
            : list.recipeIds ?? [];

        if (recipeIds.length === 0) {
          return <p>{t("lists.emptyList")}</p>;
        }

        return (
          <div>
            <p style={{ color: "#666", marginBottom: "1rem" }}>
              {recipeIds.length === 1
                ? t("lists.itemsWithCount_one", { count: recipeIds.length })
                : t("lists.itemsWithCount_other", { count: recipeIds.length })}
            </p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {recipeIds.map((recipeId, index) => (
                <li
                  key={recipeId}
                  style={{
                    padding: "0.5rem",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Link
                    href={`/recipe/${recipeId}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                    }}
                  >
                    {index + 1}. Recipe ID: {recipeId}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })()}
    </main>
  );
}
