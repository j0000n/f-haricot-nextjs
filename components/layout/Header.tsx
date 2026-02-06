"use client";

import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@haricot/convex-client";
import { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { Logo } from "@/components/logo/Logo";
import { SignInModal } from "@/components/ui/SignInModal";
import Link from "next/link";

export function Header() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  return (
    <header>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Logo size={50} color1="#478EC8" color2="#478EC8" color3="#1D154FF4" />
          </a>
        
        <nav>
          {isLoading ? (
            <span>{t("common.loading")}</span>
          ) : isAuthenticated && user ? (
            <>
              <Link href="/kitchen-dashboard" style={{ textDecoration: "underline", marginRight: "1rem" }}>
                {t("tabs.kitchen")}
              </Link>
              <Link href="/lists" style={{ textDecoration: "underline", marginRight: "1rem" }}>
                {t("tabs.lists")}
              </Link>
              <Link href="/theme" style={{ textDecoration: "underline", marginRight: "1rem" }}>
                {t("theme.themesLabel", { defaultValue: "Themes" })}
              </Link>
              {(user as { userType?: string })?.userType === "creator" && (
                <Link href="/creator" style={{ textDecoration: "underline", marginRight: "1rem" }}>
                  {t("tabs.creator")}
                </Link>
              )}
              {(user as { userType?: string })?.userType === "vendor" && (
                <Link href="/vendor" style={{ textDecoration: "underline", marginRight: "1rem" }}>
                  {t("tabs.vendor")}
                </Link>
              )}
              <Link
                href="/profile"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
                aria-label={t("profile.title")}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            </>
          ) : (
            <button
              onClick={() => setIsSignInModalOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Sign in"
            >
            LOG IN / SIGN UP
            </button>
          )}
        </nav>
        <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
      </div>
    </header>
  );
}
