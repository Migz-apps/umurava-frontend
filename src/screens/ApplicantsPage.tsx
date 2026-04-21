"use client";

import { useState } from "react";
import { Eye, Mail, Search, Star, Users } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";

const mockApplicants = [
  {
    id: 1,
    name: "Alice Uwimana",
    title: "Full-Stack Developer",
    location: "Kigali, Rwanda",
    experience: "5 years",
    skills: ["React", "Node.js", "MongoDB"],
    match: 95,
    status: "Shortlisted",
    job: "Backend Software Engineer",
  },
  {
    id: 2,
    name: "Jean Habimana",
    title: "Backend Engineer",
    location: "Rwanda",
    experience: "3 years",
    skills: ["Python", "Django", "PostgreSQL"],
    match: 88,
    status: "Under Review",
    job: "Backend Software Engineer",
  },
  {
    id: 3,
    name: "Marie Ishimwe",
    title: "Data Scientist",
    location: "Nairobi, Kenya",
    experience: "4 years",
    skills: ["Python", "TensorFlow", "SQL"],
    match: 82,
    status: "New",
    job: "Data Analyst",
  },
  {
    id: 4,
    name: "Patrick Nkurunziza",
    title: "Frontend Developer",
    location: "Rwanda",
    experience: "2 years",
    skills: ["React", "TypeScript", "Tailwind"],
    match: 79,
    status: "New",
    job: "Senior Front-End Developer",
  },
  {
    id: 5,
    name: "Grace Mukamana",
    title: "DevOps Engineer",
    location: "Rwanda",
    experience: "6 years",
    skills: ["AWS", "Docker", "Kubernetes"],
    match: 75,
    status: "Rejected",
    job: "Backend Software Engineer",
  },
];

export default function ApplicantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const filtered = mockApplicants.filter(
    (applicant) =>
      (statusFilter === "All" || applicant.status === statusFilter) &&
      applicant.name.toLowerCase().includes(search.toLowerCase()),
  );

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
        {filtered.map((applicant) => (
          <div
            key={applicant.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {applicant.name
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{applicant.name}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    applicant.status === "Shortlisted"
                      ? "bg-success/10 text-success"
                      : applicant.status === "New"
                        ? "bg-primary/10 text-primary"
                        : applicant.status === "Under Review"
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {applicant.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {applicant.title} | {applicant.experience} | {applicant.location}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Applied for: {applicant.job}
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
              <div className="mb-2 flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="text-lg font-bold text-foreground">
                  {applicant.match}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">AI Match Score</p>
              <div className="mt-2 flex gap-2">
                <button className="rounded p-1.5 text-muted-foreground hover:bg-muted">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="rounded p-1.5 text-muted-foreground hover:bg-muted">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
