"use client";

import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@haricot/convex-client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import Link from "next/link";

export default function RecipeDetailPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const params = useParams();
  const router = useRouter();
  
  const recipeId = useMemo(() => {
    const id = params.id;
    return Array.isArray(id) ? id[0] : id;
  }, [params.id]);

  const recipe = useQuery(
    api.recipes.getById,
    recipeId ? { id: recipeId as any } : "skip"
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || recipe === undefined) {
    return (
      <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <p>{t("common.loading")}</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!recipe) {
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
        <h1>{t("recipe.notFound")}</h1>
      </main>
    );
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
      
      <h1 style={{ marginBottom: "1rem" }}>Recipe Details</h1>
      
      <pre style={{ 
        background: "#f5f5f5", 
        padding: "1rem", 
        borderRadius: "8px",
        overflow: "auto",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word"
      }}>
        {JSON.stringify(recipe, null, 2)}
      </pre>
    </main>
  );
}
