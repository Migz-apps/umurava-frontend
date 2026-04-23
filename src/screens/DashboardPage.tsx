"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Clock,
  FileText,
  MapPin,
  Pencil,
  Play,
  TrendingDown,
  Users,
  Wifi,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { apiClient } from "@/lib/api";
import { notify } from "@/lib/notify";

interface DashboardStats {
  submissions: number;
  pending: number;
  totalApplicants: number;
  activeJobs: number;
}

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  employmentType: string;
  remote: boolean;
  createdAt: string;
  status: string;
  applicantsCount: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    submissions: 0,
    pending: 0,
    totalApplicants: 0,
    activeJobs: 0,
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes] = await Promise.all([
        apiClient.get<DashboardStats>("/dashboard/stats"),
        apiClient.get<Job[]>("/jobs"),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }

      if (jobsRes.success && jobsRes.data) {
        setJobs(jobsRes.data.slice(0, 3)); // Show only first 3 jobs
      }
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error);
      notify.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { label: "Total Applicants", value: (stats.totalApplicants || 0).toString(), icon: Users, color: "text-primary" },
    { label: "Submissions", value: (stats.submissions || 0).toString(), icon: FileText, color: "text-success" },
    { label: "Pending", value: (stats.pending || 0).toString(), icon: Clock, color: "text-warning" },
    { label: "Active Jobs", value: (stats.activeJobs || 0).toString(), icon: Briefcase, color: "text-primary" },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${stat.color}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
              <p className="text-3xl font-bold text-foreground">{jobs.length}</p>
              <p className="text-xs text-muted-foreground">
                Jobs currently active
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              UM
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Welcome to TalentIQ</p>
              <p className="text-sm text-muted-foreground">AI-Powered Talent Screening</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Use AI to screen and rank candidates for your job openings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-lg font-semibold text-foreground">Recent Jobs</h2>
          <Link href="/jobs" className="text-sm font-medium text-primary">
            See All
          </Link>
        </div>
        {jobs.length === 0 ? (
          <div className="p-8 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No jobs yet. Create your first job to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                  {job.company.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <span className="flex-shrink-0 rounded bg-accent px-2 py-1 text-xs font-medium text-primary">
                      {job.status}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {job.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {job.employmentType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wifi className="h-3 w-3" />
                      {job.remote ? "Remote" : "On-site"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {job.applicantsCount} applicants
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
