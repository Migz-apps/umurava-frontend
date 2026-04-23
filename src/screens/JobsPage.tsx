"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Users, Eye, Briefcase, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { apiClient } from "@/lib/api";
import { notify } from "@/lib/notify";

interface Job {
  id: string;
  title: string;
  department: string;
  company: string;
  location: string;
  employmentType: string;
  remote: boolean;
  description: string;
  responsibilities: string[];
  requiredSkills: any[];
  status: string;
  applicantsCount: number;
  createdAt: string;
}

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [form, setForm] = useState({ 
    title: "", 
    department: "", 
    company: "",
    location: "", 
    type: "Full-time", 
    description: "", 
    requirements: "", 
    skills: "" 
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Job[]>("/jobs");
      if (response.success && response.data) {
        setJobs(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch jobs:", error);
      notify.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    if (!form.title || !form.description) {
      notify.error("Please fill in required fields");
      return;
    }

    try {
      setSubmitting(true);
      const responsibilities = form.requirements
        ? form.requirements.split("\n").filter((r: string) => r.trim())
        : [];
      
      const requiredSkills = form.skills
        ? form.skills.split(",").map((skill: string) => ({
            name: skill.trim(),
            yearsRequired: 0,
            mandatory: true,
            weight: 3,
          }))
        : [];

      const response = await apiClient.post("/jobs", {
        title: form.title,
        department: form.department,
        company: form.company || "Umurava",
        location: form.location,
        employmentType: form.type,
        remote: false,
        description: form.description,
        responsibilities,
        requiredSkills,
        experienceLevel: "mid",
        status: "draft",
        shortlistSize: 10,
      });

      if (response.success) {
        notify.success("Job created successfully");
        setShowCreate(false);
        setForm({ title: "", department: "", company: "", location: "", type: "Full-time", description: "", requirements: "", skills: "" });
        fetchJobs();
      }
    } catch (error: any) {
      console.error("Failed to create job:", error);
      notify.error("Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const response = await apiClient.delete(`/jobs/${id}`);
      if (response.success) {
        notify.success("Job deleted successfully");
        fetchJobs();
      }
    } catch (error: any) {
      console.error("Failed to delete job:", error);
      notify.error("Failed to delete job");
    }
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setShowView(true);
  };

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setForm({
      title: job.title,
      department: job.department,
      company: job.company,
      location: job.location,
      type: job.employmentType,
      description: job.description,
      requirements: job.responsibilities.join("\n"),
      skills: job.requiredSkills.map((s: any) => s.name).join(", "),
    });
    setShowEdit(true);
  };

  const handleUpdateJob = async () => {
    if (!selectedJob || !form.title || !form.description) {
      notify.error("Please fill in required fields");
      return;
    }

    try {
      setSubmitting(true);
      const responsibilities = form.requirements
        ? form.requirements.split("\n").filter((r: string) => r.trim())
        : [];
      
      const requiredSkills = form.skills
        ? form.skills.split(",").map((skill: string) => ({
            name: skill.trim(),
            yearsRequired: 0,
            mandatory: true,
            weight: 3,
          }))
        : [];

      const response = await apiClient.put(`/jobs/${selectedJob.id}`, {
        title: form.title,
        department: form.department,
        company: form.company,
        location: form.location,
        employmentType: form.type,
        remote: false,
        description: form.description,
        responsibilities,
        requiredSkills,
        experienceLevel: "mid",
        status: selectedJob.status,
        shortlistSize: 10,
      });

      if (response.success) {
        notify.success("Job updated successfully");
        setShowEdit(false);
        setSelectedJob(null);
        fetchJobs();
      }
    } catch (error: any) {
      console.error("Failed to update job:", error);
      notify.error("Failed to update job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        icon={Briefcase}
        title="Jobs"
        subtitle="Manage job postings and view applicants"
        action={
          <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2.5 rounded-lg bg-primary-foreground text-primary text-sm font-semibold flex items-center gap-2 hover:bg-primary-foreground/90">
            <Plus className="w-4 h-4" /> Create Job
          </button>
        }
      />

      {/* Create Job Form */}
      {showCreate && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Create New Job</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Job Title *</label>
              <input placeholder="e.g. Backend Software Engineer" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Department</label>
              <input placeholder="e.g. Engineering" value={form.department} onChange={(e) => setForm({...form, department: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
              <input placeholder="e.g. Rwanda, Remote" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Employment Type</label>
              <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Freelance</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1.5">Description *</label>
            <textarea rows={4} placeholder="Describe the role, responsibilities..." value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1.5">Requirements</label>
            <textarea rows={3} placeholder="List the requirements..." value={form.requirements} onChange={(e) => setForm({...form, requirements: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1.5">Required Skills (comma separated)</label>
            <input placeholder="e.g. React, Node.js, TypeScript" value={form.skills} onChange={(e) => setForm({...form, skills: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1.5">Company</label>
            <input placeholder="e.g. Umurava" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreateJob} disabled={submitting} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {submitting ? "Saving..." : "Save Job"}
            </button>
            <button onClick={() => setShowCreate(false)} className="px-6 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No jobs yet. Create your first job to get started.</p>
          </div>
        ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Job Title</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Department</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Location</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Applicants</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
              <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-foreground">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.employmentType}</p>
                </td>
                <td className="px-5 py-4 text-sm text-foreground">{job.department}</td>
                <td className="px-5 py-4 text-sm text-foreground">{job.location}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Users className="h-4 w-4" />
                    {job.applicantsCount}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    job.status === 'active' ? 'bg-green-100 text-green-800' :
                    job.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => handleViewJob(job)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleEditJob(job)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDeleteJob(job.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* View Job Modal */}
      {showView && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{selectedJob.title}</h2>
              <button onClick={() => setShowView(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium text-foreground">{selectedJob.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">{selectedJob.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employment Type</p>
                  <p className="font-medium text-foreground">{selectedJob.employmentType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium text-foreground">{selectedJob.status}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-foreground whitespace-pre-wrap">{selectedJob.description}</p>
              </div>
              {selectedJob.responsibilities.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Responsibilities</p>
                  <ul className="list-disc list-inside text-foreground space-y-1">
                    {selectedJob.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedJob.requiredSkills.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.requiredSkills.map((skill: any, i) => (
                      <span key={i} className="px-2 py-1 bg-muted rounded text-sm text-foreground">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Applicants</p>
                <p className="font-medium text-foreground">{selectedJob.applicantsCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEdit && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Edit Job</h2>
              <button onClick={() => setShowEdit(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Job Title *</label>
                  <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Department</label>
                  <input value={form.department} onChange={(e) => setForm({...form, department: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
                  <input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Employment Type</label>
                  <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Freelance</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description *</label>
                <textarea rows={4} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Requirements</label>
                <textarea rows={3} value={form.requirements} onChange={(e) => setForm({...form, requirements: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Required Skills (comma separated)</label>
                <input value={form.skills} onChange={(e) => setForm({...form, skills: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleUpdateJob} disabled={submitting} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {submitting ? "Updating..." : "Update Job"}
                </button>
                <button onClick={() => setShowEdit(false)} className="px-6 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default JobsPage;
