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

const stats = [
  { label: "Submissions", value: "24", icon: FileText, color: "text-primary" },
  { label: "Pending", value: "8", icon: Clock, color: "text-warning" },
  { label: "Hired", value: "12", icon: Users, color: "text-success" },
  { label: "Declined", value: "4", icon: TrendingDown, color: "text-destructive" },
];

const jobs = [
  {
    id: 1,
    title: "Hiring a Backend Software Engineer",
    company: "Umurava",
    description:
      "Our partner global fintech company is looking for a Backend Software Engineer to support the development of new features of a B2B Global Payment Solution.",
    location: "Rwanda",
    type: "Full-time",
    mode: "Remote",
    time: "12mo ago",
    match: "Best Match",
  },
  {
    id: 2,
    title: "Hiring the Senior Front-End Developer",
    company: "Umurava",
    description:
      "Our Partner, a global tech company, is hiring a Senior Front-End Developer to lead the development of digital asset management solutions.",
    location: "Rwanda",
    type: "Full-time",
    mode: "Hybrid",
    time: "14mo ago",
    match: "Best Match",
  },
  {
    id: 3,
    title: "Hiring Part-Time Full-Stack Software Engineer",
    company: "Umurava",
    description:
      "Our Partner is hiring an intermediate Full-Stack Software Engineer who is responsible for developing, maintaining, and enhancing full-stack web applications.",
    location: "Rwanda",
    type: "Contract",
    mode: "Remote",
    time: "14mo ago",
    match: "Best Match",
  },
  {
    id: 4,
    title: "We're seeking AI Software Engineers for Umurava AI Hackathon",
    company: "Umurava",
    description:
      "We are seeking innovative teams of developers and AI enthusiasts to participate in a 15-day Umurava AI Hackathon.",
    location: "Kigali, Rwanda",
    type: "Full-time",
    mode: "Remote",
    time: "4d ago",
    match: "Best Match",
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
              <p className="text-sm text-muted-foreground">Your Engagement</p>
              <p className="text-3xl font-bold text-foreground">29</p>
              <p className="text-xs text-muted-foreground">
                Recruiter views on your profile
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              MG
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">miguel gloire</p>
              <p className="text-sm text-muted-foreground">Software Developer</p>
              <p className="mt-1 text-xs text-muted-foreground">
                You&apos;re off to a good start. Add more information so recruiters can
                better understand your experience.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Profile Completion</p>
              <p className="text-2xl font-bold text-warning">30%</p>
              <div className="mt-1 h-2 w-32 rounded-full bg-muted">
                <div className="h-full w-[30%] rounded-full bg-warning" />
              </div>
              <Link
                href="/talent-profile"
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary"
              >
                <Pencil className="h-3 w-3" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-lg font-semibold text-foreground">Job Recommendation</h2>
          <div className="flex gap-2">
            {["Best Match", "Open Jobs", "Recent", "Saved"].map((tab) => (
              <button
                key={tab}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === "Best Match"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <Link href="/job-board" className="text-sm font-medium text-primary">
            See All
          </Link>
        </div>
        <div className="divide-y divide-border">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-start gap-4 p-5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                UM
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                  <span className="flex-shrink-0 rounded bg-accent px-2 py-1 text-xs font-medium text-primary">
                    {job.match}
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
                    {job.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    {job.mode}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{job.time}</p>
              </div>
              <button className="flex-shrink-0 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
