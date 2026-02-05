"use client";

import { AnimatedLogo } from "@/components/logo/AnimatedLogo";
import { useTranslation } from "@/i18n/useTranslation";
import {
  clearPendingUserType,
  savePendingUserType,
  getPendingUserType,
  type UserTypeSelection,
} from "@/utils/pendingUserType";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useEffect, useRef, useState } from "react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const CODE_LENGTH = 6;
  const [step, setStep] = useState<"signIn" | "codeSent">("signIn");
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [userTypeSelection, setUserTypeSelection] = useState<UserTypeSelection | null>(null);
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useConvexAuth();

  const focusInput = (index: number) => {
    const ref = codeInputRefs.current[index];
    if (ref) {
      ref.focus();
    }
  };

  const resetCodeInputs = () => {
    setCodeDigits(Array(CODE_LENGTH).fill(""));
    setCode("");
    focusInput(0);
  };

  useEffect(() => {
    setCode(codeDigits.join(""));
  }, [codeDigits]);

  useEffect(() => {
    if (isOpen) {
      const loadPendingUserType = async () => {
        const pendingType = await getPendingUserType();
        if (pendingType) {
          setUserTypeSelection(pendingType);
        }
      };
      void loadPendingUserType();
    } else {
      // Reset state when modal closes
      setStep("signIn");
      setEmail("");
      setCode("");
      setCodeDigits(Array(CODE_LENGTH).fill(""));
      setVerificationError(null);
      setSubmitting(false);
    }
  }, [isOpen]);

  // Close modal when authentication succeeds
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  const handleUserTypeSelection = async (value: UserTypeSelection) => {
    setUserTypeSelection(value);
    await savePendingUserType(value);
  };

  const handleResetUserTypeSelection = async () => {
    setUserTypeSelection(null);
    await clearPendingUserType();
  };

  const handleSendCode = async () => {
    setSubmitting(true);
    setVerificationError(null);
    resetCodeInputs();
    const formData = new FormData();
    const cleanEmail = email.trim().toLowerCase();
    formData.append("email", cleanEmail);

    const languageToSend = i18n.language;
    if (languageToSend) {
      formData.append("preferredLanguage", languageToSend);
      const redirectTo = `/?preferredLanguage=${languageToSend}`;
      formData.append("redirectTo", redirectTo);
    }

    if (userTypeSelection) {
      await savePendingUserType(userTypeSelection);
    } else {
      await clearPendingUserType();
    }

    try {
      await signIn("resend", formData);
      setStep("codeSent");
      setSubmitting(false);
    } catch (error) {
      console.error("[SignInModal] Error during signIn:", error);
      alert(t("auth.errorSendCode"));
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
      // If successful, auth state will update and modal will close
      onClose();
    } catch (error) {
      console.error("Verification error:", error);
      setSubmitting(false);
      resetCodeInputs();
      setVerificationError(t("auth.invalidCodeMessage"));
    }
  };

  const languageKey = i18n.language ?? "default";
  const isCreatorMode = userTypeSelection === "creator";
  const isVendorMode = userTypeSelection === "vendor";
  const isSpecialSignUp = isCreatorMode || isVendorMode;

  const handleCodeChange = (value: string, index: number) => {
    const sanitized = value.replace(/\D/g, "");

    // Clear error when user starts typing
    if (verificationError) {
      setVerificationError(null);
    }

    setCodeDigits((prev) => {
      const next = [...prev];

      if (!sanitized) {
        next[index] = "";
        return next;
      }

      const chars = sanitized.split("").slice(0, CODE_LENGTH - index);
      chars.forEach((char, offset) => {
        next[index + offset] = char;
      });

      return next;
    });

    const nextIndex = index + sanitized.length;
    if (nextIndex < CODE_LENGTH) {
      setTimeout(() => focusInput(nextIndex), 50);
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      setCodeDigits((prev) => {
        const next = [...prev];
        next[index - 1] = "";
        return next;
      });
      focusInput(index - 1);
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const sanitized = pastedText.replace(/\D/g, "");

    if (!sanitized) {
      return;
    }

    // Clear error when user pastes
    if (verificationError) {
      setVerificationError(null);
    }

    // Distribute pasted digits across all fields
    setCodeDigits((prev) => {
      const next = [...prev];
      const digits = sanitized.split("").slice(0, CODE_LENGTH);
      
      digits.forEach((digit, offset) => {
        next[offset] = digit;
      });

      // Clear remaining fields if pasted code is shorter than CODE_LENGTH
      for (let i = digits.length; i < CODE_LENGTH; i++) {
        next[i] = "";
      }

      return next;
    });

    // Focus the last filled field or the next empty field
    const filledCount = Math.min(sanitized.length, CODE_LENGTH);
    const focusIndex = filledCount < CODE_LENGTH ? filledCount : CODE_LENGTH - 1;
    setTimeout(() => focusInput(focusIndex), 50);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "400px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            padding: "0.25rem 0.5rem",
          }}
          aria-label="Close"
        >
          ×
        </button>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <AnimatedLogo size={50} />

          {step === "signIn" ? (
            <>
              <h2 style={{ margin: 0, fontSize: "1.5rem", textAlign: "center" }}>
                {isCreatorMode
                  ? t("auth.signUpCreatorTitle")
                  : isVendorMode
                  ? t("auth.signUpVendorTitle")
                  : t("auth.signInTitle")}
              </h2>
              {isSpecialSignUp && (
                <p style={{ margin: 0, textAlign: "center", color: "#666" }}>
                  {isCreatorMode ? t("auth.signUpCreatorSubtitle") : t("auth.signUpVendorSubtitle")}
                </p>
              )}
              <input
                key={`email-${languageKey}`}
                type="email"
                placeholder={t("auth.email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && email.trim() && !submitting) {
                    void handleSendCode();
                  }
                }}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  fontSize: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                autoComplete="email"
                disabled={submitting}
              />
              <button
                onClick={handleSendCode}
                disabled={submitting || !email.trim()}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  fontSize: "1rem",
                  backgroundColor: submitting ? "#ccc" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: submitting || !email.trim() ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? t("auth.sending") : t("auth.sendCode")}
              </button>
            </>
          ) : (
            <>
              <h2 style={{ margin: 0, fontSize: "1.5rem", textAlign: "center" }}>
                {t("auth.enterCode")}
              </h2>
              <p style={{ margin: 0, textAlign: "center", color: "#666" }}>
                {t("auth.codeSentTo", { email })}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {codeDigits.map((digit, index) => (
                  <input
                    key={`code-${languageKey}-${index}`}
                    ref={(ref) => {
                      codeInputRefs.current[index] = ref;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(e.target.value, index)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    onPaste={handleCodePaste}
                    style={{
                      width: "3rem",
                      height: "3rem",
                      textAlign: "center",
                      fontSize: "1.5rem",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                    autoFocus={index === 0}
                    disabled={submitting}
                  />
                ))}
              </div>
              {verificationError && (
                <p style={{ margin: 0, color: "red", fontSize: "0.875rem" }}>{verificationError}</p>
              )}
              <button
                onClick={handleVerifyCode}
                disabled={submitting || code.length !== 6}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  fontSize: "1rem",
                  backgroundColor: submitting || code.length !== 6 ? "#ccc" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: submitting || code.length !== 6 ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? t("auth.verifying") : t("auth.verifyCode")}
              </button>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", justifyContent: "center" }}>
                <button
                  onClick={handleSendCode}
                  disabled={submitting}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#007bff",
                    cursor: submitting ? "not-allowed" : "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  {t("auth.resendCode")}
                </button>
                <span>•</span>
                <button
                  onClick={() => {
                    setStep("signIn");
                    resetCodeInputs();
                    setVerificationError(null);
                  }}
                  disabled={submitting}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#007bff",
                    cursor: submitting ? "not-allowed" : "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  {t("auth.changeEmail")}
                </button>
              </div>
            </>
          )}

          <div style={{ width: "100%", marginTop: "1rem" }}>
            {isSpecialSignUp ? (
              <button
                onClick={handleResetUserTypeSelection}
                disabled={submitting}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  color: "#007bff",
                  cursor: submitting ? "not-allowed" : "pointer",
                  textDecoration: "underline",
                  padding: "0.5rem 0",
                }}
              >
                {t("auth.returnToSignIn")}
              </button>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "#666" }}>
                  {t("auth.partnerSignUpPrompt")}
                </p>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", justifyContent: "center" }}>
                  <button
                    onClick={() => handleUserTypeSelection("creator")}
                    disabled={submitting}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#007bff",
                      cursor: submitting ? "not-allowed" : "pointer",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    {t("auth.signUpCreatorLink")}
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => handleUserTypeSelection("vendor")}
                    disabled={submitting}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#007bff",
                      cursor: submitting ? "not-allowed" : "pointer",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    {t("auth.signUpVendorLink")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
