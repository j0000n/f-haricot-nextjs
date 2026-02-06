"use client";

import type { Recipe } from "@haricot/convex-client";
import { useTokens } from "@/hooks/useTheme";
import { DashboardRecipeCard } from "./DashboardRecipeCard";

interface DashboardRecipeRailProps {
  header: string;
  recipes: Recipe[];
  userInventory: string[];
}

export function DashboardRecipeRail({
  header,
  recipes,
  userInventory,
}: DashboardRecipeRailProps) {
  const tokens = useTokens();

  if (recipes.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: tokens.padding.section,
      }}
    >
      <h2
        style={{
          fontFamily: tokens.fontFamilies.bold,
          fontSize: tokens.typography.subheading,
          color: tokens.colors.textPrimary,
          margin: `0 0 ${tokens.spacing.md}px 0`,
          padding: `0 ${tokens.padding.card}px`,
        }}
      >
        {header}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: tokens.spacing.md,
          padding: `0 ${tokens.padding.card}px`,
        }}
      >
        {recipes.slice(0, 4).map((recipe) => (
          <DashboardRecipeCard
            key={recipe._id}
            recipe={recipe}
            userInventory={userInventory}
          />
        ))}
      </div>
    </div>
  );
}
