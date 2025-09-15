import "./../styles/globals.css";
import React from "react";

export const metadata = {
  title: "Purchasing Starter (Postgres-first + yearly ref)",
  description: "Create and list requisitions with a collapsible menu."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
