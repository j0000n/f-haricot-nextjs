import "./globals.css";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

export const metadata = {
  title: "Haricot Web",
  description: "Haricot web client",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
