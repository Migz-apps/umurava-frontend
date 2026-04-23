"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  History,
  Brain,
  Calendar,
  Users,
  Clock,
  ChevronRight,
  Award,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { apiClient } from "@/lib/api";
import { notify } from "@/lib/notify";

export default function ShortlistsPage() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<any[]>("/screenings");
      if (response.success && response.data) {
        setHistory(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch screening history:", error);
      notify.error("Failed to load screening history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (ms: number | undefined) => {
    if (!ms || ms === 0) return "N/A";
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageHeader icon={History} title="Screening History" subtitle="View all past AI screening sessions" />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader icon={History} title="Screening History" subtitle="View all past AI screening sessions" />

      {history.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
            <History className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium text-foreground mb-2">No screenings yet</h3>
          <p className="text-muted-foreground mb-6">Start your first AI screening to see results here</p>
          <button
            onClick={() => router.push("/ai-screening")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            <Brain className="h-5 w-5" />
            Start Screening
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item: any, index: number) => {
            const shortlist = item.result?.shortlist || [];
            const jobTitle = item.job?.title || "Unknown Job";
            const jobCompany = item.job?.company || "Unknown Company";
            const totalCandidates = item.result?.totalApplicantsEvaluated || item.applicantIds?.length || 0;
            const processingTime = item.result?.processingTimeMs;
            const modelUsed = item.result?.modelUsed || "AI Model";
            const fallbackUsed = item.result?.fallbackUsed;

            return (
              <div
                key={item._id || index}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:border-border/80 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{jobTitle}</h3>
                        <StatusBadge status={item.status || item.result?.status || "completed"} />
                      </div>

                      <p className="text-muted-foreground text-sm mb-4">{jobCompany}</p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(item.createdAt || item.completedAt)}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {totalCandidates} candidates
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {formatDuration(processingTime)}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Award className="h-4 w-4" />
                          {modelUsed}
                          {fallbackUsed && " (Fallback)"}
                        </div>
                      </div>

                      {/* Shortlist Preview */}
                      {shortlist.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground mb-3">
                            Top {Math.min(shortlist.length, 3)} of {shortlist.length} shortlisted
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {shortlist.slice(0, 3).map((candidate: any, i: number) => (
                              <div
                                key={i}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  candidate.recommendation === "strong_yes"
                                    ? "bg-success/10 text-success"
                                    : candidate.recommendation === "yes"
                                    ? "bg-primary/10 text-primary"
                                    : candidate.recommendation === "maybe"
                                    ? "bg-warning/10 text-warning"
                                    : "bg-muted-foreground/10 text-muted-foreground"
                                }`}
                              >
                                #{candidate.rank} - {(candidate.overallScore ?? 0).toFixed(1)} pts
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      <button
                        onClick={() => router.push(`/ai-screening?screeningId=${item._id}`)}
                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                        title="View Results"
                      >
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => router.push("/ai-screening")}
                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                        title="New Screening"
                      >
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    { icon: any; className: string; label: string }
  > = {
    completed: {
      icon: CheckCircle2,
      className: "bg-success/10 text-success",
      label: "Completed",
    },
    failed: {
      icon: XCircle,
      className: "bg-destructive/10 text-destructive",
      label: "Failed",
    },
    processing: {
      icon: Loader2,
      className: "bg-warning/10 text-warning",
      label: "Processing",
    },
    pending: {
      icon: Clock,
      className: "bg-primary/10 text-primary",
      label: "Pending",
    },
  };

  const { icon: Icon, className, label } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

