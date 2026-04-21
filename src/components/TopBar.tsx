"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, KeyRound, LogOut, Menu, User as UserIcon } from "lucide-react";
import { notify } from "@/lib/notify";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
}

interface TopBarProps {
  onMenuClick: () => void;
  notifications?: Notification[];
}

export default function TopBar({
  onMenuClick,
  notifications = [],
}: TopBarProps) {
  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setOpenNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const profile = useMemo(() => {
    const fullName =
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "John Doe";
    const initials = fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return {
      fullName,
      initials: initials || "JD",
      email: user?.email || "john.doe@example.com",
    };
  }, [user]);

  const handleLogout = () => {
    setOpenProfile(false);
    dispatch(logout());
    notify.success("Logged out", "See you again soon!");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setOpenNotif((value) => !value);
              setOpenProfile(false);
            }}
            className="relative rounded-lg p-2 hover:bg-muted"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {notifications.length > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
            )}
          </button>
          {openNotif && (
            <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-white shadow-lg animate-in fade-in zoom-in-95 sm:w-80">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-foreground">Notifications</p>
              </div>
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No new notifications
                </p>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="border-b border-border px-4 py-3 last:border-0 hover:bg-muted"
                    >
                      <p className="text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {notification.description}
                      </p>
                      <p className="mt-1 text-xs text-primary">{notification.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setOpenProfile((value) => !value);
              setOpenNotif(false);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90"
            aria-label="Profile menu"
          >
            {profile.initials}
          </button>
          {openProfile && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-white shadow-lg animate-in fade-in zoom-in-95">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-foreground">
                  {profile.fullName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {profile.email}
                </p>
              </div>
              <button
                onClick={() => {
                  setOpenProfile(false);
                  router.push("/my-profile");
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                My Profile
              </button>
              <button
                onClick={() => {
                  setOpenProfile(false);
                  router.push("/update-password");
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                Update Password
              </button>
              <div className="border-t border-border" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
