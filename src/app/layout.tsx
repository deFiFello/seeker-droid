import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import the classic Inter font
import "./globals.css";

// Configure the font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SeekerDroid",
  description: "Gold-standard Solana Seeker PWA template",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply the font directly using inter.className */}
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}