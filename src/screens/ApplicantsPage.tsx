"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Mail, Search, Star, Users, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { apiClient } from "@/lib/api";
import { notify } from "@/lib/notify";

interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title?: string;
  location?: string;
  experience?: string;
  skills: string[];
  matchScore?: number;
  status: string;
  jobTitle?: string;
  createdAt: string;
}

export default function ApplicantsPage() {
  const router = useRouter();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 7;
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplicants();
  }, [page, search, statusFilter]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) params.append('search', search);
      
      const response = await apiClient.get<any>(`/applicants?${params.toString()}`);
      if (response.success && response.data) {
        // Transform backend data to match frontend interface
        const transformedApplicants = response.data.map((applicant: any) => ({
          id: applicant._id || applicant.id,
          firstName: applicant.fullName?.split(' ')[0] || applicant.firstName || '',
          lastName: applicant.fullName?.split(' ').slice(1).join(' ') || applicant.lastName || '',
          email: applicant.email,
          title: applicant.headline || applicant.title,
          location: applicant.location?.country || applicant.location,
          experience: applicant.totalExperienceYears ? `${Math.round(applicant.totalExperienceYears)} years` : applicant.experience,
          skills: applicant.skills?.map((s: any) => s.name) || applicant.skills || [],
          matchScore: applicant.matchScore,
          status: applicant.status || 'new',
          jobTitle: applicant.jobTitle,
          createdAt: applicant.createdAt,
        }));
        setApplicants(transformedApplicants);
        setTotal((response as any).meta?.total || 0);
      }
    } catch (error: any) {
      console.error("Failed to fetch applicants:", error);
      notify.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const filtered = applicants.filter(
    (applicant) =>
      (statusFilter === "All" || applicant.status === statusFilter) &&
      (applicant.firstName?.toLowerCase().includes(search.toLowerCase()) ||
       applicant.lastName?.toLowerCase().includes(search.toLowerCase())),
  );

  const totalPages = Math.ceil(total / pageSize);

  const handleViewApplicant = (applicantId: string) => {
    router.push(`/applicants/${applicantId}`);
  };

  const handleDeleteApplicant = async (applicantId: string) => {
    setDeleteConfirmId(applicantId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const response = await apiClient.delete(`/applicants/${deleteConfirmId}`);
      if (response.success) {
        notify.success("Applicant deleted successfully");
        setDeleteConfirmId(null);
        // Reset to page 1 if current page becomes empty
        if (applicants.length === 1 && page > 1) {
          setPage(1);
        } else {
          fetchApplicants();
        }
      } else {
        notify.error(response.error || "Failed to delete applicant");
      }
    } catch (error: any) {
      console.error("Failed to delete applicant:", error);
      notify.error("Failed to delete applicant");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageHeader icon={Users} title="Applicants" subtitle="View and manage all job applicants" />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading applicants...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        icon={Users}
        title="Applicants"
        subtitle="View and manage all job applicants"
      />

      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search applicants..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option>All</option>
          <option>New</option>
          <option>Under Review</option>
          <option>Shortlisted</option>
          <option>Rejected</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No applicants found.</p>
          </div>
        ) : (
          <>
            {filtered.map((applicant) => (
              <div
                key={applicant.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {applicant.firstName[0]}{applicant.lastName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{applicant.firstName} {applicant.lastName}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        applicant.status === "shortlisted"
                          ? "bg-success/10 text-success"
                          : applicant.status === "new"
                            ? "bg-primary/10 text-primary"
                            : applicant.status === "under_review"
                              ? "bg-warning/10 text-warning"
                              : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {applicant.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {applicant.title || "N/A"} | {applicant.experience || "N/A"} | {applicant.location || "N/A"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Applied for: {applicant.jobTitle || "N/A"}
                  </p>
                  <div className="mt-2 flex gap-1.5">
                    {applicant.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  {applicant.matchScore !== undefined && (
                    <>
                      <div className="mb-2 flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="text-lg font-bold text-foreground">
                          {applicant.matchScore}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">AI Match Score</p>
                    </>
                  )}
                  <div className="mt-2 flex gap-2">
                    <button 
                      onClick={() => handleViewApplicant(applicant.id)}
                      className="rounded p-1.5 text-muted-foreground hover:bg-muted"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteApplicant(applicant.id)}
                      className="rounded p-1.5 text-destructive hover:bg-destructive/10"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} applicants
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        page === pageNum
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-card hover:bg-muted"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-xl border border-border p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Delete Applicant</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this applicant? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
