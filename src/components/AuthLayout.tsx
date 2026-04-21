import type { ReactNode } from "react";
import AuthDashboardPreview from "./AuthDashboardPreview";
import UmuravaLogo from "./UmuravaLogo";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  benefits?: string[];
  rightTitle?: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle = "Welcome! Please fill in the details to get started.",
  benefits = [
    "Access Job Opportunities",
    "Build Work Experience",
    "Access Skills Development Opportunities",
  ],
  rightTitle = "Get started with\nUmurava",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex w-full flex-col bg-background lg:w-1/2">
        <div className="p-4 sm:p-6">
          <UmuravaLogo />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-8 sm:px-8">
          <div className="w-full max-w-md">
            <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
              {title}
            </h1>
            <p className="mb-6 text-sm text-muted-foreground">{subtitle}</p>
            {children}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-1 p-4 text-xs text-muted-foreground sm:flex-row sm:gap-0 sm:p-6 sm:text-sm">
          <span>umurava.africa</span>
          <span>team@umurava.africa</span>
        </div>
      </div>

      <div className="bg-blue-600 hidden w-1/2 flex-col justify-center p-8 text-primary-foreground lg:flex xl:p-16">
        <h2 className="mb-8 whitespace-pre-line text-3xl font-bold leading-tight xl:text-4xl">
          {rightTitle}
        </h2>
        <div className="mb-8 w-full">
          <AuthDashboardPreview />
        </div>
        <div className="w-full">
          <h3 className="mb-4 text-lg font-bold">Benefits</h3>
          <div className="space-y-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-foreground">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-base font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
