import {
  ArrowUpRight,
  Bell,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  Globe,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquare,
  Search,
  Settings,
  User,
} from "lucide-react";

const sidebar = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: User, label: "Talent Profile" },
  { icon: Globe, label: "Job Board" },
  { icon: DollarSign, label: "Revenues" },
  { icon: FileText, label: "Contracts" },
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help & Support" },
  { icon: LogOut, label: "Logout" },
];

const stats = [
  { label: "Total Jobs", value: "54", bg: "bg-primary", text: "text-primary-foreground" },
  { label: "In-Progress", value: "54", bg: "bg-foreground", text: "text-background" },
  { label: "Completed", value: "54", bg: "bg-success", text: "text-success-foreground" },
];

const jobs = [
  { title: "Data Analyst, IT", company: "Umurava" },
  { title: "Data Analyst, IT", company: "Umurava" },
];

export default function AuthDashboardPreview() {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-background text-foreground shadow-2xl">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded bg-primary" />
          <span className="text-[10px] font-bold text-primary">Umurava</span>
        </div>
        <div className="relative mx-2 max-w-[140px] flex-1">
          <Search className="absolute left-1.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 text-muted-foreground" />
          <div className="rounded-full bg-muted py-1 pl-5 pr-2 text-[8px] text-muted-foreground">
            Search dashboard
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Bell className="h-2.5 w-2.5 text-muted-foreground" />
          <div className="flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5">
            <MessageSquare className="h-2.5 w-2.5 text-muted-foreground" />
            <span className="text-[8px] text-muted-foreground">Messages (10)</span>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="flex w-24 flex-col gap-0.5 border-r border-border bg-card p-1.5">
          <div className="mb-1 flex flex-col items-center rounded bg-muted p-1 text-center">
            <div className="mb-0.5 h-6 w-6 rounded-full bg-primary" />
            <p className="text-[7px] font-semibold leading-tight text-foreground">
              Prince Levy Pascal
            </p>
            <p className="text-[6px] text-muted-foreground">UI/UX designer</p>
            <div className="mt-0.5 rounded-full bg-primary px-1.5 text-[6px] text-primary-foreground">
              Profile
            </div>
          </div>
          {sidebar.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-1 rounded px-1 py-0.5 ${
                item.active ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-2 w-2" />
              <span className="text-[7px] font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 bg-muted/30 p-2">
          <div className="mb-2 grid grid-cols-4 gap-1">
            {stats.map((stat) => (
              <div key={stat.label} className={`${stat.bg} ${stat.text} relative rounded p-1.5`}>
                <p className="text-[7px] opacity-80">{stat.label}</p>
                <p className="mt-0.5 text-sm font-bold leading-none">{stat.value}</p>
                <ArrowUpRight className="absolute right-1 top-1 h-2.5 w-2.5 opacity-80" />
              </div>
            ))}
            <div className="rounded bg-gradient-to-br from-warning to-destructive p-1.5 text-primary-foreground">
              <p className="text-[6px] font-bold leading-tight">
                Merry Christmas &amp; Happy New Year
              </p>
            </div>
          </div>

          <p className="mb-1 text-[8px] font-semibold text-foreground">
            Jobs recommendations (10)
          </p>

          <div className="grid grid-cols-2 gap-1">
            {[...jobs, ...jobs].map((job, index) => (
              <div key={`${job.title}-${index}`} className="rounded border border-border bg-card p-1.5">
                <div className="mb-1 flex items-start justify-between">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-primary" />
                    <div>
                      <p className="text-[7px] font-bold leading-none text-foreground">
                        {job.title}
                      </p>
                      <p className="text-[6px] text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary px-1 py-0.5 text-[6px] text-primary-foreground">
                    Best fit
                  </span>
                </div>
                <p className="mb-1 text-[6px] leading-tight text-muted-foreground">
                  Looking for a Data Analyst who will be delivering several projects from our
                  partner organizations in various fields.
                </p>
                <div className="flex flex-wrap gap-0.5">
                  {[
                    { icon: Briefcase, label: "Rwanda" },
                    { icon: Clock, label: "Full-time" },
                    { icon: MapPin, label: "7 days left" },
                    { icon: Briefcase, label: "On Site" },
                  ].map((tag) => (
                    <span
                      key={tag.label}
                      className="flex items-center gap-0.5 rounded-full bg-muted px-1 py-0.5 text-[6px] text-muted-foreground"
                    >
                      <tag.icon className="h-1.5 w-1.5" />
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[7px] text-muted-foreground">
            <span>Showing 4 of 20 jobs</span>
            <div className="flex gap-1">
              <span>&lt; Previous</span>
              <span>Next &gt;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
