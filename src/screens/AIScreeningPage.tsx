"use client";

import { useState } from "react";
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Loader2,
  Play,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";

const mockJobs = [
  { id: 1, title: "Backend Software Engineer", applicants: 45 },
  { id: 2, title: "Senior Front-End Developer", applicants: 32 },
  { id: 3, title: "Data Analyst", applicants: 18 },
];

const mockResults = [
  {
    rank: 1,
    name: "Alice Uwimana",
    score: 95,
    skills: "React, Node.js, MongoDB",
    experience: "5 years",
    reasoning:
      "Strong full-stack background with relevant project experience in fintech. Excellent match for backend role with Node.js expertise.",
  },
  {
    rank: 2,
    name: "Jean Habimana",
    score: 88,
    skills: "Python, Django, PostgreSQL",
    experience: "3 years",
    reasoning:
      "Solid backend skills with Python ecosystem. Good database experience. Slightly less experience but strong fundamentals.",
  },
  {
    rank: 3,
    name: "Patrick Nkurunziza",
    score: 82,
    skills: "React, TypeScript, Tailwind",
    experience: "2 years",
    reasoning:
      "Strong frontend skills that translate well. TypeScript proficiency is valuable. Less backend-specific experience.",
  },
  {
    rank: 4,
    name: "Marie Ishimwe",
    score: 79,
    skills: "Python, TensorFlow, SQL",
    experience: "4 years",
    reasoning:
      "Data science background with good SQL skills. Could transition to backend role. AI/ML skills are a bonus.",
  },
  {
    rank: 5,
    name: "Grace Mukamana",
    score: 75,
    skills: "AWS, Docker, Kubernetes",
    experience: "6 years",
    reasoning:
      "Excellent infrastructure knowledge. DevOps skills complement backend development. Strong senior-level experience.",
  },
];

export default function AIScreeningPage() {
  const [selectedJob, setSelectedJob] = useState("");
  const [topN, setTopN] = useState("10");
  const [screening, setScreening] = useState(false);
  const [results, setResults] = useState<typeof mockResults | null>(null);

  const handleScreen = () => {
    setScreening(true);
    setResults(null);
    window.setTimeout(() => {
      setScreening(false);
      setResults(mockResults);
    }, 3000);
  };

  return (
    <DashboardLayout>
      <PageHeader
        icon={Bot}
        title="AI Screening"
        subtitle="Use AI to screen and rank applicants for your job postings"
      />

      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Configure Screening</h2>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Select Job *
            </label>
            <select
              value={selectedJob}
              onChange={(event) => setSelectedJob(event.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Choose a job posting</option>
              {mockJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.applicants} applicants)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Shortlist Size
            </label>
            <select
              value={topN}
              onChange={(event) => setTopN(event.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
              <option value="20">Top 20</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleScreen}
              disabled={!selectedJob || screening}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {screening ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Screening...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Run AI Screening
                </>
              )}
            </button>
          </div>
        </div>

        {screening && (
          <div className="flex items-center gap-3 rounded-lg bg-accent p-4">
            <Loader2 className="h-5 w-5 animate-spin text-accent-foreground" />
            <div>
              <p className="text-sm font-medium text-accent-foreground">
                AI is analyzing applicants...
              </p>
              <p className="text-xs text-muted-foreground">
                Matching candidates against job requirements, scoring skills,
                experience, and relevance.
              </p>
            </div>
          </div>
        )}
      </div>

      {results && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h2 className="text-lg font-semibold text-foreground">Screening Results</h2>
              <span className="text-sm text-muted-foreground">
                Top {results.length} Candidates
              </span>
            </div>
            <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
              Export Results
            </button>
          </div>
          <div className="divide-y divide-border">
            {results.map((result) => (
              <div key={result.rank} className="flex items-start gap-4 p-5">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    result.rank <= 3
                      ? "bg-warning/10 text-warning"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  #{result.rank}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-3">
                    <h3 className="font-semibold text-foreground">{result.name}</h3>
                    <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5">
                      <span className="text-sm font-bold text-success">
                        {result.score}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {result.skills} | {result.experience}
                  </p>
                  <div className="mt-2 rounded-lg bg-muted/50 p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">AI Reasoning:</span>{" "}
                        {result.reasoning}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
