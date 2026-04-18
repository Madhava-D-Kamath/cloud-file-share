import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloudDrop | Premium File Sharing",
  description: "Secure, fast, and beautiful cloud file sharing system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
