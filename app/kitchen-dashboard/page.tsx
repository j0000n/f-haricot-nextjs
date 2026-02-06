"use client";

import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@haricot/convex-client";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/styles/themeContext";
import { ThemeStyles } from "@/components/ThemeStyles";
import { useFullscreen } from "@/hooks/useFullscreen";
import { FullscreenButton } from "@/components/dashboard/FullscreenButton";
import { BentoGrid } from "@/components/dashboard/BentoGrid";
import { DashboardRecipeRail } from "@/components/dashboard/DashboardRecipeRail";
import { useTokens } from "@/hooks/useTheme";

export default function KitchenDashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const router = useRouter();
  const { isFullscreen } = useFullscreen();

  // Redirect if not authenticated (delay to allow Convex to restore session from storage)
  useEffect(() => {
    if (authLoading || isAuthenticated) return;
    const timer = setTimeout(() => {
      router.push("/");
    }, 800);
    return () => clearTimeout(timer);
  }, [isAuthenticated, authLoading, router]);

  // Get user data for theme preferences
  const user = useQuery(api.users.getCurrentUser);
  const household = useQuery(api.households.getHousehold);

  // Extract inventory codes
  const inventoryCodes = useMemo(() => {
    if (!household || household.status !== "member") {
      return [];
    }

    const inventory = household.household.inventory ?? [];
    const codes = new Set<string>();

    for (const item of inventory) {
      codes.add(item.itemCode);
      if (item.varietyCode) {
        codes.add(item.varietyCode);
      }
    }

    return Array.from(codes);
  }, [household]);

  // Fetch all recipe rails
  const rails = useQuery(api.recipes.listPersonalizedRails, {
    limit: 4,
    railTypes: [
      "forYou",
      "readyToCook",
      "quickEasy",
      "cuisines",
      "dietaryFriendly",
      "householdCompatible",
    ],
  });

  // Get theme preferences from user
  const preferredTheme = (user as { preferredTheme?: string | null } | null)?.preferredTheme;
  const customThemeShareCode = (user as { customThemeShareCode?: string | null } | null)
    ?.customThemeShareCode;
  const rawHighContrastMode = (user as { highContrastMode?: "off" | "light" | "dark" | boolean | null } | null)
    ?.highContrastMode;
  const highContrastMode =
    typeof rawHighContrastMode === "boolean"
      ? rawHighContrastMode
        ? "dark"
        : "off"
      : rawHighContrastMode ?? "off";

  // Fetch custom theme if share code exists
  const customThemeData = useQuery(
    api.customThemes.getThemeByShareCode,
    customThemeShareCode ? { shareCode: customThemeShareCode } : "skip"
  );

  if (authLoading || user === undefined || household === undefined || rails === undefined) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <ThemeProvider
      initialThemeName={preferredTheme}
      initialCustomThemeShareCode={customThemeShareCode}
      customThemeData={customThemeData}
      initialAccessibilityPreferences={{ highContrastMode }}
    >
      <ThemeStyles />
      <DashboardContent
        rails={rails}
        inventoryCodes={inventoryCodes}
        isFullscreen={isFullscreen}
      />
    </ThemeProvider>
  );
}

function DashboardContent({
  rails,
  inventoryCodes,
  isFullscreen,
}: {
  rails: Record<string, any[]>;
  inventoryCodes: string[];
  isFullscreen: boolean;
}) {
  const tokens = useTokens();

  const railConfig = [
    { key: "readyToCook", label: "Ready to Cook" },
    { key: "forYou", label: "For You" },
    { key: "quickEasy", label: "Quick & Easy" },
    { key: "cuisines", label: "Your Favorite Cuisines" },
    { key: "dietaryFriendly", label: "Dietary Friendly" },
    { key: "householdCompatible", label: "For Your Household" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: tokens.colors.background,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!isFullscreen && <Header />}

      <main
        style={{
          flex: 1,
          width: "100%",
          position: "relative",
        }}
      >
        <FullscreenButton />

        <BentoGrid>
          {railConfig.map(({ key, label }) => {
            const recipes = rails[key] ?? [];
            if (recipes.length === 0) {
              return null;
            }

            return (
              <DashboardRecipeRail
                key={key}
                header={label}
                recipes={recipes}
                userInventory={inventoryCodes}
              />
            );
          })}
        </BentoGrid>
      </main>

      {!isFullscreen && <Footer />}
    </div>
  );
}
