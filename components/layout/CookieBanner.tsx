"use client";

import CookieConsent from "react-cookie-consent";
import Link from "next/link";

export function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Sprejmem"
      cookieName="sp_cookie_consent"
      style={{
        background: "#0f172a",
        color: "#e2e8f0",
        fontSize: "14px",
        lineHeight: "1.5",
      }}
      buttonStyle={{
        background: "var(--slovenia-blue)",
        color: "#fff",
        fontSize: "13px",
        borderRadius: "8px",
        padding: "10px 16px",
      }}
      expires={365}
    >
      Ta stran uporablja piškotke za delovanje ankete, shranjevanje stanja glasovanja
      in osnovno analitiko. Z nadaljevanjem se strinjate z uporabo piškotkov.{" "}
      <Link href="/#" className="underline hover:no-underline">
        Več o piškotkih
      </Link>
      .
    </CookieConsent>
  );
}
