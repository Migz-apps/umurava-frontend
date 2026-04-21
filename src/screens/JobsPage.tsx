"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Users, Eye, Briefcase } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";

const mockJobs = [
  { id: 1, title: "Backend Software Engineer", department: "Engineering", location: "Rwanda", type: "Full-time", applicants: 45, status: "Active", posted: "2025-03-15" },
  { id: 2, title: "Senior Front-End Developer", department: "Engineering", location: "Rwanda", type: "Full-time", applicants: 32, status: "Active", posted: "2025-02-20" },
  { id: 3, title: "Data Analyst", department: "Data & AI", location: "Remote", type: "Contract", applicants: 18, status: "Draft", posted: "2025-04-01" },
  { id: 4, title: "Full-Stack Software Engineer", department: "Engineering", location: "Rwanda", type: "Part-time", applicants: 27, status: "Closed", posted: "2025-01-10" },
];

const JobsPage = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", department: "", location: "", type: "Full-time", description: "", requirements: "", skills: "" });

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
          <div className="flex gap-3">
            <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Save Job</button>
            <button onClick={() => setShowCreate(false)} className="px-6 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
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
            {mockJobs.map((job) => (
              <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-foreground">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.type}</p>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{job.department}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{job.location}</td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-1 text-sm text-foreground"><Users className="w-4 h-4 text-muted-foreground" />{job.applicants}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    job.status === "Active" ? "bg-success/10 text-success" :
                    job.status === "Draft" ? "bg-warning/10 text-warning" :
                    "bg-muted text-muted-foreground"
                  }`}>{job.status}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Eye className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded hover:bg-muted text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default JobsPage;
