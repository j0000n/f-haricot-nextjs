"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@haricot/convex-client";
import { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";

export function Header() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const user = useQuery(api.users.getCurrentUser);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"signIn" | "codeSent">("signIn");
  const [submitting, setSubmitting] = useState(false);

  const handleSendCode = async () => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("email", email.trim().toLowerCase());

    try {
      await signIn("resend", formData);
      setStep("codeSent");
      setSubmitting(false);
    } catch (error) {
      console.error("Error during signIn:", error);
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("code", code.trim());

    try {
      await signIn("resend", formData);
      // If successful, auth state will update
      setStep("signIn");
      setEmail("");
      setCode("");
    } catch (error) {
      console.error("Verification error:", error);
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1><a href="/" style={{ textDecoration: "none", color: "inherit" }}>haricot</a></h1>
        <nav>
          {isLoading ? (
            <span>{t("common.loading")}</span>
          ) : isAuthenticated && user ? (
            <>
              <span>{user.email ?? user.name ?? "User"}</span>
              <a href="/profile" style={{ textDecoration: "underline" }}>{t("profile.title")}</a>
              <button onClick={handleSignOut}>{t("profile.logOut")}</button>
            </>
          ) : (
            <>
              {step === "signIn" ? (
                <>
                  <input
                    type="email"
                    placeholder={t("auth.email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ padding: "0.5rem" }}
                  />
                  <button onClick={handleSendCode} disabled={submitting || !email}>
                    {submitting ? t("auth.sending") : t("auth.sendCode")}
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder={t("auth.codePlaceholder")}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    style={{ padding: "0.5rem", width: "100px" }}
                  />
                  <button onClick={handleVerifyCode} disabled={submitting || code.length !== 6}>
                    {submitting ? t("auth.verifying") : t("auth.verifyCode")}
                  </button>
                  <button onClick={() => setStep("signIn")}>{t("auth.changeEmail")}</button>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
