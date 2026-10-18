import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRAFFIQ CLOUD | Intelligent Roads. Connected Cities.",
  description: "A premium demonstration of smart city traffic monitoring and connected road operations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
