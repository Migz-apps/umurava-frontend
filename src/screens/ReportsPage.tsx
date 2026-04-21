"use client";

import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { FileText, BarChart3, TrendingUp } from "lucide-react";

const ReportsPage = () => {
  return (
    <DashboardLayout>
      <PageHeader icon={BarChart3} title="Reports" subtitle="Analytics and insights from your screening activities" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><FileText className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">122</p>
              <p className="text-sm text-muted-foreground">Total Applicants Screened</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-success" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">87%</p>
              <p className="text-sm text-muted-foreground">Avg. Match Accuracy</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-warning" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">3.2x</p>
              <p className="text-sm text-muted-foreground">Faster than Manual Review</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <BarChart3 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">Detailed Analytics Coming Soon</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">Charts and detailed breakdowns of screening performance, skill distribution, and hiring pipeline metrics will be displayed here.</p>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;

