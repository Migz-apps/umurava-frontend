"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Briefcase, GraduationCap, Award, Calendar, Loader2, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { apiClient } from "@/lib/api";
import { notify } from "@/lib/notify";

interface Applicant {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  headline?: string;
  summary?: string;
  location?: { city: string; country: string };
  skills: Array<{ name: string; yearsOfExperience: number; level: string }>;
  workExperience: Array<{
    role: string;
    company: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    field: string;
    institution: string;
    startYear: number;
    endYear?: number;
  }>;
  certifications: Array<{ name: string; issuer: string; year?: number }>;
  languages: Array<{ name: string; proficiency: string }>;
  availability: { immediateStart: boolean; noticePeriod?: string };
  expectedSalary?: { min?: number; max?: number; currency?: string };
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  totalExperienceYears?: number;
  createdAt: string;
}

export default function ApplicantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicantId = params.id as string;
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchApplicant();
  }, [applicantId]);

  const fetchApplicant = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<any>(`/applicants/${applicantId}`);
      if (response.success && response.data) {
        setApplicant(response.data);
      } else {
        notify.error("Failed to load applicant details");
      }
    } catch (error: any) {
      console.error("Failed to fetch applicant:", error);
      notify.error("Failed to load applicant details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await apiClient.delete(`/applicants/${applicantId}`);
      if (response.success) {
        notify.success("Applicant deleted successfully");
        router.push("/applicants");
      } else {
        notify.error(response.error || "Failed to delete applicant");
      }
    } catch (error: any) {
      console.error("Failed to delete applicant:", error);
      notify.error("Failed to delete applicant");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!applicant) {
    return (
      <DashboardLayout>
        <PageHeader title="Applicant Not Found" />
        <div className="p-8 text-center">
          <p className="text-muted-foreground">The applicant you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/applicants")}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground"
          >
            Back to Applicants
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader title="Applicant Details" />
      
      <button
        onClick={() => router.push("/applicants")}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Applicants
      </button>

      <div className="space-y-6">
        {/* Header Card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {applicant.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{applicant.fullName}</h1>
                <p className="text-muted-foreground">{applicant.headline || "No headline"}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {applicant.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {applicant.email}
                    </div>
                  )}
                  {applicant.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {applicant.location.city}, {applicant.location.country}
                    </div>
                  )}
                  {applicant.totalExperienceYears && (
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {Math.round(applicant.totalExperienceYears)} years experience
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setDeleteConfirm(true)}
              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              title="Delete Applicant"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {applicant.summary && (
            <div className="mt-4 pt-4 border-t border-border">
              <h3 className="font-semibold text-foreground mb-2">Professional Summary</h3>
              <p className="text-sm text-muted-foreground">{applicant.summary}</p>
            </div>
          )}
        </div>

        {/* Skills */}
        {applicant.skills && applicant.skills.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {applicant.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
                >
                  {skill.name} {skill.yearsOfExperience && `(${skill.yearsOfExperience}yr)`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {applicant.workExperience && applicant.workExperience.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience
            </h3>
            <div className="space-y-4">
              {applicant.workExperience.map((exp, idx) => (
                <div key={idx} className="border-l-2 border-border pl-4">
                  <h4 className="font-semibold text-foreground">{exp.role}</h4>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                      {exp.achievements.map((achievement, aIdx) => (
                        <li key={aIdx}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {applicant.education && applicant.education.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education
            </h3>
            <div className="space-y-3">
              {applicant.education.map((edu, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{edu.degree} in {edu.field}</h4>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    <p className="text-xs text-muted-foreground">
                      {edu.startYear} - {edu.endYear || "Ongoing"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {applicant.certifications && applicant.certifications.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Certifications</h3>
            <div className="space-y-2">
              {applicant.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-foreground">{cert.name}</span>
                  <span className="text-muted-foreground">by {cert.issuer}</span>
                  {cert.year && <span className="text-muted-foreground">({cert.year})</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {applicant.languages && applicant.languages.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {applicant.languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-muted px-3 py-1.5 text-sm text-foreground"
                >
                  {lang.name} ({lang.proficiency})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Availability & Salary */}
        {(applicant.availability || applicant.expectedSalary) && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Availability & Expectations</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available to start:</span>
                <span className="text-foreground font-medium">
                  {applicant.availability?.immediateStart ? "Immediately" : `${applicant.availability?.noticePeriod} days notice`}
                </span>
              </div>
              {applicant.expectedSalary && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected Salary:</span>
                  <span className="text-foreground font-medium">
                    {applicant.expectedSalary.min && applicant.expectedSalary.max
                      ? `${applicant.expectedSalary.currency || "$"}${applicant.expectedSalary.min} - ${applicant.expectedSalary.max}`
                      : applicant.expectedSalary.min
                        ? `${applicant.expectedSalary.currency || "$"}${applicant.expectedSalary.min}+`
                        : "Not specified"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Links */}
        {(applicant.linkedinUrl || applicant.githubUrl || applicant.portfolioUrl) && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Links</h3>
            <div className="flex flex-wrap gap-3">
              {applicant.linkedinUrl && (
                <a
                  href={applicant.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {applicant.githubUrl && (
                <a
                  href={applicant.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  GitHub
                </a>
              )}
              {applicant.portfolioUrl && (
                <a
                  href={applicant.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Portfolio
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-xl border border-border p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Delete Applicant</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete {applicant.fullName}? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
