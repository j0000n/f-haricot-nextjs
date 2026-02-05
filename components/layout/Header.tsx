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
        <h1>
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Logo size={75} color1="#A22B2B" color2="#1AC01D" color3="#290EDDF4" />
          </a>
        </h1>
        <nav>
          {isLoading ? (
            <span>{t("common.loading")}</span>
          ) : isAuthenticated && user ? (
            <>
              <Link href="/lists" style={{ textDecoration: "underline", marginRight: "1rem" }}>
                {t("tabs.lists")}
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
