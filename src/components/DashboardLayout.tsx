"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  BarChart3,
  BookOpen,
  Bot,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  FileText,
  GraduationCap,
  Handshake,
  LayoutDashboard,
  LogOut,
  Network,
  Plus,
  Settings,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import { useAppDispatch } from "@/store";
import { logoutUser } from "@/store/slices/authSlice";
import TopBar from "./TopBar";
import UmuravaLogo from "./UmuravaLogo";

const TALENT_NAV = [
  {
    section: "FIND JOBS",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { label: "Talent Profile", icon: User, path: "/talent-profile" },
      { label: "Job Board", icon: Briefcase, path: "/job-board", hasDropdown: true },
      { label: "AI Job Matching", icon: Bot, path: "/ai-matching", indent: true },
    ],
  },
  {
    section: "GROW YOUR CAREER",
    items: [
      { label: "EdTech Solutions", icon: GraduationCap, path: "/edtech" },
      { label: "Career Resources", icon: BookOpen, path: "/career-resources" },
      { label: "Partner Programs", icon: Users, path: "/partner-programs" },
      { label: "Apprenticeship", icon: Award, path: "/apprenticeship" },
      { label: "Career Network", icon: Network, path: "/career-network" },
      { label: "Mentorship", icon: Handshake, path: "/mentorship" },
    ],
  },
];

const RECRUITER_NAV = [
  {
    section: "SCREENING",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { label: "Jobs", icon: Briefcase, path: "/jobs" },
      { label: "Applicants", icon: Users, path: "/applicants" },
      { label: "AI Screening", icon: Bot, path: "/ai-screening" },
      { label: "Shortlists", icon: BarChart3, path: "/shortlists" },
    ],
  },
  {
    section: "MANAGEMENT",
    items: [
      { label: "Add Applicant", icon: Plus, path: "/applicants/new" },
      { label: "Upload Applicants", icon: Upload, path: "/upload-applicants" },
      { label: "Reports", icon: FileText, path: "/reports" },
      { label: "Settings", icon: Settings, path: "/settings" },
    ],
  },
];

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
  hasDropdown?: boolean;
  indent?: boolean;
}

interface DashboardLayoutProps {
  children: ReactNode;
  userType?: "talent" | "recruiter";
}

export default function DashboardLayout({
  children,
  userType = "recruiter",
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const navSections = userType === "talent" ? TALENT_NAV : RECRUITER_NAV;

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  const sidebarBase =
    "flex flex-col border-r border-border bg-card transition-all duration-200";
  const desktopWidth = collapsed ? "lg:w-16" : "lg:w-60";

  return (
    <div className="flex min-h-screen bg-muted/30">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`${sidebarBase} ${desktopWidth}
          fixed left-0 top-0 z-50 h-screen w-64
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} transition-transform
          lg:sticky lg:translate-x-0`}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          {!collapsed && <UmuravaLogo />}
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded p-1 hover:bg-muted lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => setCollapsed((value) => !value)}
            className="hidden rounded p-1 hover:bg-muted lg:block"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              className={`h-5 w-5 text-muted-foreground transition-transform ${collapsed ? "rotate-180" : ""
                }`}
            />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navSections.map((section) => (
            <div key={section.section} className="mb-4">
              {!collapsed && (
                <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-primary">
                  {section.section}
                </p>
              )}
              {section.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <NavEntry
                    key={item.path}
                    item={item}
                    isActive={isActive}
                    collapsed={collapsed}
                    onClick={() => setMobileOpen(false)}
                  />
                );
              })}
            </div>
          ))}
        </nav>

      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

interface NavEntryProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}

function NavEntry({ item, isActive, collapsed, onClick }: NavEntryProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.path}
      onClick={onClick}
      className={`mx-2 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${isActive
          ? "bg-primary text-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent"
        } ${item.indent ? "ml-6" : ""}`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
        </>
      )}
    </Link>
  );
}
