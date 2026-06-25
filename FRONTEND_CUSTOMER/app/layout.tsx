import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "In-Aisle Product Display",
  description: "Read-only in-aisle price and product display",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
