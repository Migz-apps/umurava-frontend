"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react";

const credentials = [
  { role: "Recruiter", email: "recruiter@test.com", password: "Test1234!" },
  { role: "Talent", email: "talent@test.com", password: "Test1234!" },
  { role: "Company Admin", email: "admin@company.com", password: "Admin1234!" },
];

export default function TestCredentials() {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState("");

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-border bg-card shadow-lg">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-foreground"
      >
        Test Credentials
        {open ? (
          <ChevronDown className="ml-auto h-4 w-4" />
        ) : (
          <ChevronUp className="ml-auto h-4 w-4" />
        )}
      </button>
      {open && (
        <div className="space-y-3 px-4 pb-4">
          {credentials.map((credential) => (
            <div key={credential.role} className="rounded-lg bg-muted p-3 text-sm">
              <p className="mb-1 font-semibold text-primary">{credential.role}</p>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email:</span>
                <button
                  onClick={() => handleCopy(credential.email, `${credential.role}-email`)}
                  className="flex items-center gap-1 font-mono text-xs text-foreground"
                >
                  {credential.email}
                  {copied === `${credential.role}-email` ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-muted-foreground">Pass:</span>
                <button
                  onClick={() =>
                    handleCopy(credential.password, `${credential.role}-password`)
                  }
                  className="flex items-center gap-1 font-mono text-xs text-foreground"
                >
                  {credential.password}
                  {copied === `${credential.role}-password` ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
