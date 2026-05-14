import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
export const metadata: Metadata = { title: "MVP — Accessibility Platform", description: "AI-assisted accessibility scanning and repair for enterprises and government." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"/>
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
