"use client";

import { useState } from "react";
import { Upload, FileText, X, CheckCircle2, UploadCloud, Download, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { apiClient } from "@/lib/api";
import { notify } from "@/lib/notify";

const UploadApplicantsPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    totalRows: number;
    importedCount: number;
    applicantIds: string[];
    rowErrors: Array<{ row: number; error: string }>;
  } | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      notify.error("Please select at least one file to upload");
      return;
    }

    try {
      setUploading(true);
      setUploaded(false);
      setUploadResult(null);

      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.upload("/screenings/upload/csv", formData);
      
      if (response.success && response.data) {
        setUploaded(true);
        const data = response.data as { totalRows: number; importedCount: number; applicantIds: string[]; rowErrors: Array<{ row: number; error: string }> };
        notify.success(`${data.importedCount} applicants imported successfully`);
        setUploadResult(data);
        setFiles([]);
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      notify.error("Failed to upload applicants");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => setFiles(files.filter((_, i) => i !== index));

  const downloadTemplate = () => {
    const csvContent = `fullName,email,headline,skills,location,city,country,experience_years
John Doe,john@example.com,Senior React Developer,"React,TypeScript,Node.js",Rwanda,Kigali,Rwanda,5
Jane Smith,jane@example.com,Full-Stack Engineer,"Python,Django,PostgreSQL",Kenya,Nairobi,Kenya,4
Bob Johnson,bob@example.com,DevOps Engineer,"AWS,Kubernetes,Docker",Nigeria,Lagos,Nigeria,6`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applicants_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <PageHeader icon={UploadCloud} title="Upload Applicants" subtitle="Import applicant data from CSV, Excel spreadsheets, or PDF resumes" />

      {!uploaded ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template Download */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Download Template</h2>
            <p className="text-sm text-muted-foreground mb-4">Use our CSV template to ensure your data is formatted correctly.</p>
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
            >
              <Download className="w-4 h-4" />
              Download template.csv
            </button>
          </div>

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
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => removeFile(i)} className="p-1 hover:bg-background rounded"><X className="w-4 h-4 text-muted-foreground" /></button>
                  </div>
                ))}
                <button onClick={handleUpload} disabled={uploading}
                  className="w-full mt-3 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {uploading ? "Uploading..." : "Upload & Process"}
                </button>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Required Columns</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success"></span>
                <code className="text-sm text-foreground">fullName</code>
                <span className="text-xs text-muted-foreground">(required)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success"></span>
                <code className="text-sm text-foreground">email</code>
                <span className="text-xs text-muted-foreground">(required, unique)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                <code className="text-sm text-foreground">headline</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                <code className="text-sm text-foreground">skills</code>
                <span className="text-xs text-muted-foreground">(comma-separated)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                <code className="text-sm text-foreground">location / city / country</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                <code className="text-sm text-foreground">experience_years</code>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            {uploadResult?.importedCount === uploadResult?.totalRows ? (
              <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-10 w-10 text-warning" />
              </div>
            )}
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {uploadResult?.importedCount === uploadResult?.totalRows
                ? 'Import Successful!'
                : 'Import Completed with Warnings'}
            </h2>
            <p className="text-muted-foreground">
              {uploadResult?.importedCount} of {uploadResult?.totalRows} applicants imported successfully
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{uploadResult?.totalRows}</p>
              <p className="text-sm text-muted-foreground">Total Rows</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-3xl font-bold text-success">{uploadResult?.importedCount}</p>
              <p className="text-sm text-muted-foreground">Imported</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-3xl font-bold text-destructive">{uploadResult?.rowErrors.length}</p>
              <p className="text-sm text-muted-foreground">Errors</p>
            </div>
          </div>

          {/* Errors */}
          {uploadResult && uploadResult.rowErrors.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Import Errors
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {uploadResult.rowErrors.map((error, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5">
                    <span className="text-destructive font-mono text-sm">Row {error.row}</span>
                    <span className="text-foreground text-sm">{error.error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setUploaded(false);
                setUploadResult(null);
                setFiles([]);
              }}
              className="px-6 py-3 rounded-xl bg-card border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              Upload Another File
            </button>
            <button
              onClick={() => window.location.href = '/applicants'}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              View Applicants
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UploadApplicantsPage;

