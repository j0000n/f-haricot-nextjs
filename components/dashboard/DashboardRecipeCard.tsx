"use client";

import type { Recipe } from "@haricot/convex-client";
import { useTokens } from "@/hooks/useTheme";
import { useRecipeCardImageUrl } from "@/hooks/useRecipeCardImageUrl";
import { calculateIngredientMatch } from "@/utils/inventory";
import { formatRecipeTime } from "@/utils/recipes";
import { getRecipeLanguage } from "@/utils/translation";
import { useTranslation } from "@/i18n/useTranslation";
import Link from "next/link";

interface DashboardRecipeCardProps {
  recipe: Recipe;
  userInventory: string[];
}

export function DashboardRecipeCard({ recipe, userInventory }: DashboardRecipeCardProps) {
  const tokens = useTokens();
  const { t, i18n } = useTranslation();
  const currentLanguage = getRecipeLanguage(i18n.language || "en") as keyof Recipe["recipeName"];

  const { matchPercentage, missingIngredients } = calculateIngredientMatch(
    recipe.ingredients,
    userInventory
  );

  const imageUrl = useRecipeCardImageUrl(recipe);

  const hasInventory = userInventory.length > 0;
  const shouldShowMatch = hasInventory && matchPercentage < 100;

  const badgeColor =
    matchPercentage >= 75
      ? tokens.colors.success
      : matchPercentage >= 50
      ? tokens.colors.info
      : tokens.colors.danger;

  const recipeName = recipe.recipeName[currentLanguage] || recipe.recipeName.en || "Recipe";

  return (
    <Link
      href={`/recipe/${recipe._id}`}
      style={{
        display: "block",
        width: "100%",
        borderRadius: `${tokens.radii.md}px`,
        border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
        backgroundColor: tokens.colors.surface,
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.15)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          overflow: "hidden",
          backgroundColor: tokens.colors.imageBackgroundColor,
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={recipeName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: tokens.colors.imageBackgroundColor,
              color: tokens.colors.textMuted,
              fontFamily: tokens.fontFamilies.regular,
              fontSize: tokens.typography.body,
            }}
          >
            {recipeName}
          </div>
        )}

        {shouldShowMatch && (
          <div
            style={{
              position: "absolute",
              top: tokens.spacing.xs,
              left: tokens.spacing.xs,
              padding: `${tokens.spacing.xxs}px ${tokens.spacing.xs}px`,
              borderRadius: `${tokens.radii.sm}px`,
              backgroundColor: badgeColor,
              color: tokens.colors.accentOnPrimary,
              fontFamily: tokens.fontFamilies.semiBold,
              fontSize: tokens.typography.tiny,
            }}
          >
            {matchPercentage}%
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: tokens.spacing.xs,
            right: tokens.spacing.xs,
            padding: `${tokens.spacing.xxs}px ${tokens.spacing.xs}px`,
            borderRadius: `${tokens.radii.sm}px`,
            backgroundColor: tokens.colors.overlay,
            color: tokens.colors.textPrimary,
            fontFamily: tokens.fontFamilies.medium,
            fontSize: tokens.typography.tiny,
          }}
        >
          {formatRecipeTime(recipe.totalTimeMinutes)}
        </div>
      </div>

      <div style={{ padding: tokens.padding.card }}>
        <h3
          style={{
            fontFamily: tokens.fontFamilies.semiBold,
            fontSize: tokens.typography.body,
            color: tokens.colors.textPrimary,
            margin: `0 0 ${tokens.spacing.xxs}px 0`,
            lineHeight: tokens.lineHeights.tight,
          }}
        >
          {recipeName}
        </h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: tokens.spacing.xxs,
            marginBottom: tokens.spacing.xxs,
          }}
        >
          {recipe.emojiTags.slice(0, 5).map((emoji, index) => (
            <span key={index} style={{ fontSize: tokens.typography.heading }}>
              {emoji}
            </span>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: tokens.typography.tiny,
            color: tokens.colors.textSecondary,
            fontFamily: tokens.fontFamilies.regular,
          }}
        >
          <span>
            {recipe.servings} {t("common.servings", { defaultValue: "servings" })}
          </span>
          {hasInventory && missingIngredients > 0 && (
            <span style={{ color: tokens.colors.danger }}>
              {missingIngredients} {t("recipe.missingIngredients", { defaultValue: "missing" })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
