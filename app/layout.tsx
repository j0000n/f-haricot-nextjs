import "./globals.css";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export const metadata = {
  title: "Haricot Web",
  description: "Haricot web client",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
