import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl bg-primary px-5 py-5 text-primary-foreground shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
      <div className="min-w-0">
        <h1 className="flex items-center gap-2 text-xl font-bold leading-tight sm:text-2xl">
          {Icon && <Icon className="h-6 w-6" />}
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-primary-foreground/80">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
