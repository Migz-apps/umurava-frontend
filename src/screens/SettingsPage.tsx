"use client";

import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Settings as SettingsIcon } from "lucide-react";

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <PageHeader icon={SettingsIcon} title="Settings" subtitle="Manage your account and application settings" />

      <div className="space-y-6 max-w-2xl">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Profile Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
              <input defaultValue="John" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
              <input defaultValue="Doe" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input defaultValue="recruiter@test.com" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <button className="mt-4 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Save Changes</button>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">API Configuration</h2>
          <p className="text-sm text-muted-foreground mb-4">Configure your Gemini API key for AI screening.</p>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Gemini API Key</label>
            <input type="password" defaultValue="••••••••••••••••" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button className="mt-4 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Update API Key</button>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Notifications</h2>
          <div className="space-y-3">
            {["Email notifications for new applicants", "AI screening completion alerts", "Weekly summary reports"].map((item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-input text-primary focus:ring-ring" />
                <span className="text-sm text-foreground">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;

