"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Settings as SettingsIcon } from "lucide-react";
import { apiClient } from "@/lib/api";
import { notify } from "@/lib/notify";
import { updateProfile, fetchCurrentUser } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store";

interface UserSettings {
  geminiApiKey?: string;
}

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
  });
  const [settings, setSettings] = useState<UserSettings>({
    geminiApiKey: "",
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company || "",
        jobTitle: user.jobTitle || "",
      });
    }
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get<UserSettings>("/user/settings");
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const response = await apiClient.put("/user/profile", profileForm);
      if (response.success) {
        notify.success("Profile updated successfully");
        dispatch(fetchCurrentUser(undefined));
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      notify.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateApiKey = async () => {
    try {
      setSaving(true);
      const response = await apiClient.put("/user/api-key", { geminiApiKey: settings.geminiApiKey });
      if (response.success) {
        notify.success("API key updated successfully");
      }
    } catch (error: any) {
      console.error("Failed to update API key:", error);
      notify.error("Failed to update API key");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      const response = await apiClient.put("/user/settings", settings);
      if (response.success) {
        notify.success("Settings updated successfully");
      }
    } catch (error: any) {
      console.error("Failed to update settings:", error);
      notify.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageHeader icon={SettingsIcon} title="Settings" subtitle="Manage your account and application settings" />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader icon={SettingsIcon} title="Settings" subtitle="Manage your account and application settings" />

      <div className="space-y-6 max-w-2xl">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Profile Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
              <input value={profileForm.firstName} onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
              <input value={profileForm.lastName} onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Company</label>
              <input value={profileForm.company} onChange={(e) => setProfileForm({...profileForm, company: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Job Title</label>
              <input value={profileForm.jobTitle} onChange={(e) => setProfileForm({...profileForm, jobTitle: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <button onClick={handleSaveProfile} disabled={saving} className="mt-4 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">API Configuration</h2>
          <p className="text-sm text-muted-foreground mb-4">Configure your Gemini API key for AI screening.</p>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Gemini API Key</label>
            <input type="password" value={settings.geminiApiKey} onChange={(e) => setSettings({...settings, geminiApiKey: e.target.value})}
              placeholder="Enter your Gemini API key"
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button onClick={handleUpdateApiKey} disabled={saving} className="mt-4 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
            {saving ? "Updating..." : "Update API Key"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;

