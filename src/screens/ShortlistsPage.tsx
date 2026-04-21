"use client";

import { useState } from "react";
import { BarChart3, Calendar, ChevronDown, Download, Eye, Star } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { notify } from "@/lib/notify";

interface Candidate {
  name: string;
  role: string;
  score: number;
  description: string;
}

interface Shortlist {
  id: number;
  jobTitle: string;
  date: string;
  candidates: number;
  topScore: number;
  status: "Complete" | "Pending Review";
  list: Candidate[];
}

const shortlists: Shortlist[] = [
  {
    id: 1,
    jobTitle: "Backend Software Engineer",
    date: "2025-04-10",
    candidates: 10,
    topScore: 95,
    status: "Complete",
    list: [
      {
        name: "Aline Uwase",
        role: "Senior Backend Engineer",
        score: 95,
        description: "5y Node.js / NestJS, strong Postgres, ex-Andela. Led payment APIs.",
      },
      {
        name: "Bruno Mukasa",
        role: "Backend Engineer",
        score: 92,
        description: "Go + Node.js, distributed systems experience at fintech startup.",
      },
      {
        name: "Claudine Ingabire",
        role: "Full-Stack to Backend",
        score: 89,
        description: "Python/Django, microservices, AWS deployment background.",
      },
      {
        name: "David Niyonzima",
        role: "Backend Engineer",
        score: 86,
        description: "TypeScript, NestJS, MongoDB. 3y B2B SaaS.",
      },
    ],
  },
  {
    id: 2,
    jobTitle: "Senior Front-End Developer",
    date: "2025-04-08",
    candidates: 5,
    topScore: 88,
    status: "Complete",
    list: [
      {
        name: "Esther Kayitesi",
        role: "Senior Front-End",
        score: 88,
        description: "React, Next.js, design systems. Shipped 2 large dashboards.",
      },
      {
        name: "Frank Habimana",
        role: "Front-End Engineer",
        score: 84,
        description: "React + TypeScript, strong UX sense, animation experience.",
      },
    ],
  },
  {
    id: 3,
    jobTitle: "Data Analyst",
    date: "2025-04-12",
    candidates: 10,
    topScore: 82,
    status: "Pending Review",
    list: [
      {
        name: "Grace Mutoni",
        role: "Data Analyst",
        score: 82,
        description: "SQL, Python, Tableau. Banking domain.",
      },
      {
        name: "Henry Bizimana",
        role: "BI Analyst",
        score: 78,
        description: "PowerBI, Excel, statistical modeling.",
      },
    ],
  },
];

export default function ShortlistsPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId((value) => (value === id ? null : id));
  };

  return (
    <DashboardLayout>
      <PageHeader
        icon={BarChart3}
        title="Shortlists"
        subtitle="View all AI-generated candidate shortlists"
      />

      <div className="space-y-4">
        {shortlists.map((shortlist) => {
          const isOpen = openId === shortlist.id;

          return (
            <div
              key={shortlist.id}
              className="overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">
                    {shortlist.jobTitle}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {shortlist.date}
                    </span>
                    <span>{shortlist.candidates} candidates</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      Top: {shortlist.topScore}%
                    </span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      shortlist.status === "Complete"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {shortlist.status}
                  </span>
                  <button
                    onClick={() => toggle(shortlist.id)}
                    className={`rounded-lg p-2 text-muted-foreground hover:bg-muted ${
                      isOpen ? "bg-muted text-primary" : ""
                    }`}
                    aria-label="View candidates"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      notify.success("Download started", `${shortlist.jobTitle} shortlist`)
                    }
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                    aria-label="Download"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => toggle(shortlist.id)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                    aria-label="Expand"
                  >
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-border bg-muted/30 px-4 py-4 sm:px-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                    Candidates meeting the criteria
                  </p>
                  <div className="space-y-2">
                    {shortlist.list.map((candidate) => (
                      <div
                        key={candidate.name}
                        className="flex items-start gap-3 rounded-lg border border-border bg-card p-3"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                          {candidate.name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              {candidate.name}
                            </p>
                            <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-bold text-success">
                              {candidate.score}% match
                            </span>
                          </div>
                          <p className="text-xs text-primary">{candidate.role}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {candidate.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
