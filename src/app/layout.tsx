import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import TestCredentials from "@/components/TestCredentials";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Umurava AI",
  description: "Umurava AI talent and recruitment dashboard",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Providers>
          {children}
          <TestCredentials />
        </Providers>
      </body>
    </html>
  );
}
