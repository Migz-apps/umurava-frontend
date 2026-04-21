"use client";

import { useState } from "react";
import { Upload, FileText, X, CheckCircle2, AlertCircle, UploadCloud } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";

const UploadApplicantsPage = () => {
  const [files, setFiles] = useState<{name: string; size: string; type: string}[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files).map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + " KB", type: f.type }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + " KB", type: f.type }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => { setUploading(false); setUploaded(true); }, 2000);
  };

  const removeFile = (index: number) => setFiles(files.filter((_, i) => i !== index));

  return (
    <DashboardLayout>
      <PageHeader icon={UploadCloud} title="Upload Applicants" subtitle="Import applicant data from CSV, Excel spreadsheets, or PDF resumes" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Upload Files</h2>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          >
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">Drag & drop files here</p>
            <p className="text-xs text-muted-foreground mb-3">Supports CSV, XLSX, PDF resumes</p>
            <label className="inline-flex px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:opacity-90">
              Browse Files
              <input type="file" multiple accept=".csv,.xlsx,.xls,.pdf" onChange={handleFileInput} className="hidden" />
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                  <button onClick={() => removeFile(i)} className="p-1 hover:bg-background rounded"><X className="w-4 h-4 text-muted-foreground" /></button>
                </div>
              ))}
              <button onClick={handleUpload} disabled={uploading}
                className="w-full mt-3 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {uploading ? "Processing..." : "Upload & Process"}
              </button>
            </div>
          )}

          {uploaded && (
            <div className="mt-4 bg-success/10 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <p className="text-sm text-success font-medium">Files uploaded successfully! Applicant data has been processed.</p>
            </div>
          )}
        </div>

        {/* Manual Entry */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Manual Job Details Entry</h2>
          <p className="text-sm text-muted-foreground mb-4">For external job board screening, enter the job details manually:</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Job Title</label>
              <input placeholder="e.g. Backend Developer" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Required Skills</label>
              <input placeholder="e.g. Python, Django, PostgreSQL" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Experience Required</label>
              <input placeholder="e.g. 3+ years" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Job Description</label>
              <textarea rows={3} placeholder="Describe the ideal candidate..." className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
            <button className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              Save Job Details
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-accent rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-accent-foreground">Supported Formats</p>
          <p className="text-xs text-muted-foreground mt-1">CSV/Excel: Columns should include name, email, skills, experience, education. PDF: Individual resumes will be parsed automatically using AI.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadApplicantsPage;

