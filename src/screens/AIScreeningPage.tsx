"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Briefcase,
  Users,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Brain,
  Clock,
  Award,
  TrendingUp,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  BriefcaseIcon,
  AlertTriangle,
  Search,
  X,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { apiClient } from "@/lib/api";
import { notify } from "@/lib/notify";

interface Job {
  _id: string;
  title: string;
  company: string;
  requiredSkills: Array<{ name: string }>;
  applicantsCount: number;
}

interface Applicant {
  _id: string;
  fullName: string;
  email: string;
  headline: string;
  location?: { city: string; country: string };
  skills: Array<{ name: string }>;
}

interface ScreeningResult {
  rank: number;
  applicantId: string;
  overallScore: number;
  recommendation: string;
  reasoning: string;
  scoreBreakdown: {
    weightedSkills: number;
    weightedExperience: number;
    weightedEducation: number;
    weightedRelevance: number;
  };
  keyHighlights: string[];
  riskFactors: string[];
  strengths: string[];
  gaps: string[];
  needsHumanReview: boolean;
  finalDecisionNote: string;
  applicant: Applicant;
}

export default function AIScreeningPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedScreeningId = searchParams.get("screeningId");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [shortlistSize, setShortlistSize] = useState<5 | 10 | 15 | 20>(10);
  const [screening, setScreening] = useState(false);
  const [polling, setPolling] = useState(false);
  const [screeningRequestId, setScreeningRequestId] = useState<string | null>(preselectedScreeningId || null);
  const [result, setResult] = useState<any>(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(true);
  const [loadingResult, setLoadingResult] = useState(!!preselectedScreeningId);
  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const [screeningPayload, setScreeningPayload] = useState<any>(null);
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
  const [applicantSearch, setApplicantSearch] = useState("");
  const [searchField, setSearchField] = useState<"name" | "skills" | "experience">("name");
  const [resultsPage, setResultsPage] = useState(1);
  const resultsPageSize = 3;
  const [applicantsPage, setApplicantsPage] = useState(1);
  const applicantsPageSize = 3;

  useEffect(() => {
    fetchJobs();
    fetchApplicants();
  }, []);

  useEffect(() => {
    const loadExistingResult = async () => {
      if (preselectedScreeningId) {
        try {
          setLoadingResult(true);
          const response = await apiClient.get<any>(`/screenings/${preselectedScreeningId}`);
          if (response.success && response.data) {
            setResult(response.data);
            setScreeningRequestId(preselectedScreeningId);
            if (response.data.jobId) {
              setSelectedJobId(response.data.jobId);
            }
          }
        } catch (error) {
          console.error("Failed to load screening result:", error);
          notify.error("Failed to load screening result");
        } finally {
          setLoadingResult(false);
        }
      }
    };
    loadExistingResult();
  }, [preselectedScreeningId]);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const response = await apiClient.get<Job[]>("/jobs");
      if (response.success && response.data) {
        setJobs(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch jobs:", error);
      notify.error("Failed to load jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchApplicants = async () => {
    try {
      setLoadingApplicants(true);
      const response = await apiClient.get<Applicant[]>("/applicants");
      if (response.success && response.data) {
        setApplicants(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch applicants:", error);
      notify.error("Failed to load applicants");
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    if (!screeningRequestId || result?.status === "completed" || result?.status === "failed") {
      return;
    }

    setPolling(true);
    const interval = setInterval(async () => {
      try {
        const response = await apiClient.get<any>(`/screenings/${screeningRequestId}`);
        if (response.success && response.data) {
          setResult(response.data);
          if (response.data.status === "completed" || response.data.status === "failed") {
            clearInterval(interval);
            setPolling(false);

            await fetchJobs();
            
            if (response.data.status === "completed") {
              notify.success("Screening completed successfully", undefined, true);
              
              // Show warning if fallback API key was used
              if (response.data.result?.fallbackUsed || response.data.result?.usingServerKey) {
                notify.warning(
                  "Using default API key",
                  "We used a fallback API key for AI screening. Next time, add your own API key in Settings for better performance and reliability, as the default key may have rate limits.",
                  true
                );
              }
            } else {
              // Check if error message indicates AI evaluation failure
              const errorMessage = response.data.message || response.data.errorMessage || "";
              if (errorMessage.toLowerCase().includes("ai evaluation failed") || 
                  errorMessage.toLowerCase().includes("api quota") ||
                  errorMessage.toLowerCase().includes("authentication failed") ||
                  errorMessage.toLowerCase().includes("network timeout") ||
                  errorMessage.toLowerCase().includes("gemini retry")) {
                notify.error(
                  "AI evaluation failed",
                  "The AI service encountered an error during evaluation. The system fell back to rule-based scoring. Please check your API key configuration or try again later.",
                  true
                );
              } else {
                notify.error("Screening failed");
              }
              
              // Show warning if fallback API key failed
              if (response.data.errorDetails?.fallbackUsed) {
                notify.error(
                  "Fallback API key failed",
                  "The fallback API key encountered an error. Please add your own Gemini API key in Settings for reliable AI screening.",
                  true
                );
              }
            }
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [screeningRequestId, result?.status]);

  const handleStartScreening = async (confirmFallback: boolean = false) => {
    if (!selectedJobId) {
      notify.error("Please select a job");
      return;
    }

    setScreening(true);
    try {
      const payload = {
        jobId: selectedJobId,
        applicantIds: selectedApplicants.length > 0 ? selectedApplicants : undefined,
        shortlistSize: shortlistSize as 5 | 10 | 15 | 20,
        confirmFallback,
      };

      const response = await apiClient.post<any>("/screenings", payload);

      if (response.success) {
        setScreeningRequestId(response.data.screeningRequestId);
        setResult(response.data);
        setShowFallbackModal(false);
        notify.success("AI screening started", undefined, true);
      } else if (response.error === 'API key required' && response.data?.requiresApiKey) {
        notify.error(
          "API key required",
          response.data.message || "AI screening requires a Gemini API key. Please add your API key in Settings.",
          true
        );
      } else if (response.error === 'Fallback API key confirmation required' && response.data?.requiresFallbackConfirmation) {
        // Store the payload and show confirmation modal
        setScreeningPayload(payload);
        setShowFallbackModal(true);
        notify.warning(
          "Fallback API key confirmation required",
          response.data.message,
          true
        );
      } else if (response.error?.includes("already in progress") && response.data?.screeningRequestId) {
        setScreeningRequestId(response.data.screeningRequestId);
        notify.warning(
          "Screening already in progress",
          "A screening request for this job and applicant set is already running. Please be patient while we process your request. We'll track the existing screening for you."
        );
      } else {
        notify.error(response.error || "Failed to start screening");
      }
    } catch (error: any) {
      console.error("Failed to start screening:", error);
      notify.error(error.message || "Failed to start screening");
    } finally {
      setScreening(false);
    }
  };

  const handleConfirmFallback = () => {
    setShowFallbackModal(false);
    handleStartScreening(true);
  };

  const handleCancelFallback = () => {
    setShowFallbackModal(false);
    setScreeningPayload(null);
    notify.info("Screening cancelled. Please add your own API key in Settings for better performance.");
  };

  const handleReset = () => {
    setResult(null);
    setScreeningRequestId(null);
    setSelectedJobId("");
    setSelectedApplicants([]);
    setExpandedCandidate(null);
  };

  const toggleApplicant = (id: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const selectAllApplicants = () => {
    setSelectedApplicants(applicants.map((a) => a._id));
  };

  const deselectAllApplicants = () => {
    setSelectedApplicants([]);
  };

  const filteredApplicants = applicants.filter((applicant) => {
    if (!applicantSearch) return true;
    const searchLower = applicantSearch.toLowerCase();
    switch (searchField) {
      case "name":
        return applicant.fullName.toLowerCase().includes(searchLower);
      case "skills":
        return applicant.skills.some((skill) => skill.name.toLowerCase().includes(searchLower));
      case "experience":
        return applicant.headline?.toLowerCase().includes(searchLower) || false;
      default:
        return true;
    }
  });

  const applicantsTotalPages = Math.ceil(filteredApplicants.length / applicantsPageSize);
  const displayedApplicants = filteredApplicants.slice(
    (applicantsPage - 1) * applicantsPageSize,
    applicantsPage * applicantsPageSize
  );

  // Filter and paginate screening results
  const filteredResults = (result?.result?.shortlist || []).filter((candidate: ScreeningResult) => {
    if (!applicantSearch) return true;
    const searchLower = applicantSearch.toLowerCase();
    const fullName = candidate.applicant?.fullName?.toLowerCase() || "";
    const skills = candidate.applicant?.skills?.map((s: any) => s.name).join(" ").toLowerCase() || "";
    const headline = candidate.applicant?.headline?.toLowerCase() || "";
    
    switch (searchField) {
      case "name":
        return fullName.includes(searchLower);
      case "skills":
        return skills.includes(searchLower);
      case "experience":
        return headline.includes(searchLower);
      default:
        return true;
    }
  });

  const resultsTotalPages = Math.ceil(filteredResults.length / resultsPageSize);
  const paginatedResults = filteredResults.slice(
    (resultsPage - 1) * resultsPageSize,
    resultsPage * resultsPageSize
  );

  if (loadingJobs || loadingApplicants || loadingResult) {
    return (
      <DashboardLayout>
        <PageHeader icon={Brain} title="AI Screening" subtitle="Use AI to screen and rank applicants" />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Results View
  if (result && result.status !== "idle") {
    return (
      <DashboardLayout>
        <PageHeader icon={Brain} title="AI Screening Results" subtitle={jobs.find((j) => j._id === selectedJobId)?.title} />

        {result.status === "processing" && (
          <div className="mb-8 p-8 rounded-xl bg-primary/10 border border-primary/20 text-center">
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-lg font-semibold text-foreground mb-2">AI is analyzing candidates...</p>
            <p className="text-muted-foreground">Evaluating skills, experience, and fit against job requirements</p>
          </div>
        )}

        {result.status === "completed" && result.result && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card rounded-xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Candidates Evaluated</p>
                <p className="text-2xl font-bold text-foreground">{result.result.totalApplicantsEvaluated || result.result.shortlist?.length || 0}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Shortlisted</p>
                <p className="text-2xl font-bold text-success">{result.result.shortlist?.length || 0}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Processing Time</p>
                <p className="text-2xl font-bold text-foreground">{Math.round((result.result.processingTimeMs || 0) / 1000)}s</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <p className="text-sm text-muted-foreground">AI Model</p>
                <p className="text-2xl font-bold text-primary">{result.result.fallbackUsed ? "Fallback" : "Gemini"}</p>
              </div>
            </div>

            {/* Search Bar for Results */}
            <div className="mb-6 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={applicantSearch}
                  onChange={(event) => {
                    setApplicantSearch(event.target.value);
                    setResultsPage(1);
                  }}
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <select
                value={searchField}
                onChange={(event) => {
                  setSearchField(event.target.value as "name" | "skills" | "experience");
                  setResultsPage(1);
                }}
                className="rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="name">Search by Name</option>
                <option value="skills">Search by Skills</option>
                <option value="experience">Search by Experience</option>
              </select>
            </div>

            {/* Ranked Candidates */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Award className="h-5 w-5 text-warning" />
                  Ranked Shortlist
                </h3>
                <p className="text-sm text-muted-foreground">
                  Showing {paginatedResults.length > 0 ? ((resultsPage - 1) * resultsPageSize) + 1 : 0}-{Math.min(resultsPage * resultsPageSize, filteredResults.length)} of {filteredResults.length}
                </p>
              </div>
              {paginatedResults.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-border bg-card">
                  <p className="text-muted-foreground">No candidates found matching your search.</p>
                </div>
              ) : (
                <>
                  {paginatedResults.map((candidate: ScreeningResult, index: number) => {
                const isExpanded = expandedCandidate === candidate.applicantId;
                return (
                  <div key={candidate.applicantId} className="bg-card rounded-xl border border-border overflow-hidden">
                    <button
                      onClick={() => setExpandedCandidate(isExpanded ? null : candidate.applicantId)}
                      className="w-full p-6 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold bg-primary text-primary-foreground">
                            #{candidate.rank}
                          </div>
                          <div className="mt-2 text-2xl font-bold text-foreground">
                            {(candidate.overallScore ?? 0).toFixed(1)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-bold text-foreground">{candidate.applicant?.fullName || "Unknown"}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              candidate.recommendation === "strong_yes"
                                ? "bg-success/20 text-success"
                                : candidate.recommendation === "yes"
                                ? "bg-primary/20 text-primary"
                                : candidate.recommendation === "maybe"
                                ? "bg-warning/20 text-warning"
                                : "bg-destructive/20 text-destructive"
                            }`}>
                              {candidate.recommendation.replace(/_/g, " ").toUpperCase()}
                            </span>
                          </div>
                          <p className="text-primary text-sm mb-3">{candidate.applicant?.headline || ""}</p>
                          
                          {/* Score Breakdown with Progress Bars */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Skills</span>
                                <span className="font-medium text-foreground">{Math.round(candidate.scoreBreakdown?.weightedSkills || 0)}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary transition-all duration-500"
                                  style={{ width: `${candidate.scoreBreakdown?.weightedSkills || 0}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Experience</span>
                                <span className="font-medium text-foreground">{Math.round(candidate.scoreBreakdown?.weightedExperience || 0)}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-success transition-all duration-500"
                                  style={{ width: `${candidate.scoreBreakdown?.weightedExperience || 0}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Education</span>
                                <span className="font-medium text-foreground">{Math.round(candidate.scoreBreakdown?.weightedEducation || 0)}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-warning transition-all duration-500"
                                  style={{ width: `${candidate.scoreBreakdown?.weightedEducation || 0}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Relevance</span>
                                <span className="font-medium text-foreground">{Math.round(candidate.scoreBreakdown?.weightedRelevance || 0)}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-info transition-all duration-500"
                                  style={{ width: `${candidate.scoreBreakdown?.weightedRelevance || 0}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {candidate.applicant?.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5" />
                                {candidate.applicant.email}
                              </span>
                            )}
                            {candidate.applicant?.location?.city && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {candidate.applicant.location.city}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-6 pt-6 border-t border-border space-y-6">
                          {/* AI Reasoning */}
                          <div>
                            <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                              <Brain className="h-4 w-4 text-primary" />
                              AI Reasoning
                            </h5>
                            <p className="text-sm text-muted-foreground leading-relaxed">{candidate.reasoning}</p>
                          </div>

                          {/* Strengths */}
                          {candidate.strengths && candidate.strengths.length > 0 && (
                            <div>
                              <h5 className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Key Strengths
                              </h5>
                              <ul className="space-y-2">
                                {candidate.strengths.map((strength: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <div className="h-1.5 w-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                                    <span>{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Gaps */}
                          {candidate.gaps && candidate.gaps.length > 0 && (
                            <div>
                              <h5 className="text-sm font-semibold text-warning mb-3 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                Areas for Improvement
                              </h5>
                              <ul className="space-y-2">
                                {candidate.gaps.map((gap: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <div className="h-1.5 w-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
                                    <span>{gap}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Key Highlights */}
                          {candidate.keyHighlights && candidate.keyHighlights.length > 0 && (
                            <div>
                              <h5 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                Key Highlights
                              </h5>
                              <ul className="space-y-2">
                                {candidate.keyHighlights.map((highlight: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <span>{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Final Decision Note */}
                          {candidate.finalDecisionNote && (
                            <div className="p-4 rounded-xl bg-muted/50 border border-border">
                              <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                Final Decision
                              </h5>
                              <p className="text-sm text-muted-foreground">{candidate.finalDecisionNote}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </>
              )}

              {/* Pagination Controls */}
              {resultsTotalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-border">
                  <button
                    onClick={() => setResultsPage(p => Math.max(1, p - 1))}
                    disabled={resultsPage === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Page {resultsPage} of {resultsTotalPages}
                  </span>
                  <button
                    onClick={() => setResultsPage(p => Math.min(resultsTotalPages, p + 1))}
                    disabled={resultsPage === resultsTotalPages}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <button onClick={handleReset} className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90">
              <RefreshCw className="h-5 w-5" />
              Start New Screening
            </button>
          </>
        )}

        {result.status === "failed" && (
          <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/30 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Screening Failed</h3>
            <p className="text-muted-foreground">Something went wrong during the AI screening process.</p>
            <button onClick={handleReset} className="mt-4 px-6 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted transition-colors">
              Try Again
            </button>
          </div>
        )}
      </DashboardLayout>
    );
  }

  // Form View
  return (
    <DashboardLayout>
      <PageHeader icon={Brain} title="AI Screening" subtitle="Select a job and candidates to evaluate" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Selection */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Select Job
            </h2>
            {jobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No jobs available</p>
                <button onClick={() => router.push("/jobs/new")} className="text-primary hover:underline">
                  Create a job first →
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {jobs.map((job) => (
                  <button
                    key={job._id}
                    onClick={() => setSelectedJobId(job._id)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedJobId === job._id
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-card border border-border hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{job.applicantsCount || 0} applicants</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Shortlist Size */}
          <div className="mt-4 bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Shortlist Size</h2>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((size) => (
                <button
                  key={size}
                  onClick={() => setShortlistSize(size as 5 | 10 | 15 | 20)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    shortlistSize === size
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Candidate Selection */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Select Candidates
              </h2>
              <div className="flex gap-2">
                <button onClick={selectAllApplicants} className="text-sm text-primary hover:underline">
                  Select All
                </button>
                <span className="text-muted-foreground">|</span>
                <button onClick={deselectAllApplicants} className="text-sm text-muted-foreground hover:underline">
                  Clear
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4 space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search applicants..."
                    value={applicantSearch}
                    onChange={(e) => {
                      setApplicantSearch(e.target.value);
                      setApplicantsPage(1);
                    }}
                    className="w-full pl-10 pr-10 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {applicantSearch && (
                    <button
                      onClick={() => {
                        setApplicantSearch("");
                        setApplicantsPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <select
                  value={searchField}
                  onChange={(e) => {
                    setSearchField(e.target.value as "name" | "skills" | "experience");
                    setApplicantsPage(1);
                  }}
                  className="px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="name">By Name</option>
                  <option value="skills">By Skills</option>
                  <option value="experience">By Experience</option>
                </select>
              </div>
              {filteredApplicants.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Showing {displayedApplicants.length > 0 ? ((applicantsPage - 1) * applicantsPageSize) + 1 : 0}-{Math.min(applicantsPage * applicantsPageSize, filteredApplicants.length)} of {filteredApplicants.length} applicant{filteredApplicants.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {applicants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No applicants available</p>
                <button onClick={() => router.push("/applicants/new")} className="text-primary hover:underline">
                  Add applicants first →
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedApplicants.length} of {displayedApplicants.length} shown (of {applicants.length} total) selected
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                  {displayedApplicants.map((applicant) => (
                    <button
                      key={applicant._id}
                      onClick={() => toggleApplicant(applicant._id)}
                      className={`flex items-start gap-3 p-4 rounded-xl text-left transition-all ${
                        selectedApplicants.includes(applicant._id)
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-card border border-border hover:bg-muted"
                      }`}
                    >
                      <div className={`h-5 w-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedApplicants.includes(applicant._id)
                          ? "bg-primary border-primary"
                          : "border-border"
                      }`}>
                        {selectedApplicants.includes(applicant._id) && (
                          <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{applicant.fullName}</h3>
                        <p className="text-sm text-muted-foreground truncate">{applicant.email}</p>
                        <p className="text-xs text-primary mt-1">{applicant.headline || ""}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Pagination Controls */}
                {applicantsTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
                    <button
                      onClick={() => setApplicantsPage(p => Math.max(1, p - 1))}
                      disabled={applicantsPage === 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>
                    <span className="text-sm text-muted-foreground">
                      Page {applicantsPage} of {applicantsTotalPages}
                    </span>
                    <button
                      onClick={() => setApplicantsPage(p => Math.min(applicantsTotalPages, p + 1))}
                      disabled={applicantsPage === applicantsTotalPages}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <button
            onClick={() => handleStartScreening(false)}
            disabled={screening || !selectedJobId}
            className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50"
          >
            {screening ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Starting Screening...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Start AI Screening
              </>
            )}
          </button>
        </div>

        {/* Fallback Confirmation Modal */}
        {showFallbackModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Fallback API Key Warning</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                You are about to use the default fallback API key for AI screening. This key may have rate limits and reduced performance. For the best experience, please add your own Gemini API key in Settings.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCancelFallback}
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-background hover:bg-muted/50 text-foreground font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmFallback}
                  className="flex-1 px-4 py-3 rounded-xl bg-warning text-warning-foreground hover:bg-warning/90 font-medium transition-colors"
                >
                  Proceed with Fallback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
