"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { notify } from "@/lib/notify";
import { useAppDispatch } from "@/store";
import { loginSuccess } from "@/store/slices/authSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (value: string) => {
    if (!value) {
      return "Email is required";
    }
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      return "Invalid format";
    }
    return "";
  };

  const getRoleFromEmail = (value: string) => {
    if (value.includes("talent")) {
      return "talent" as const;
    }
    if (value.includes("admin")) {
      return "company" as const;
    }
    return "recruiter" as const;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextEmailError = validateEmail(email);
    const nextPasswordError = password ? "" : "Password is required";

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) {
      notify.error(nextEmailError || nextPasswordError);
      return;
    }

    dispatch(
      loginSuccess({
        email,
        firstName: "John",
        lastName: "Doe",
        role: getRoleFromEmail(email),
      }),
    );
    notify.success("Welcome back!");
    router.push("/dashboard");
  };

  return (
    <AuthLayout title="Login" rightTitle="Welcome back">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (emailError) {
                setEmailError(validateEmail(event.target.value));
              }
            }}
            onBlur={() => setEmailError(validateEmail(email))}
            className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${emailError
                ? "border-[hsl(0_80%_75%)] bg-[hsl(0_85%_98%)] focus:ring-[hsl(0_80%_75%)]"
                : "border-input focus:ring-ring"
              }`}
          />
          {emailError && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-[hsl(0_75%_45%)]">
              <AlertCircle className="h-3.5 w-3.5" />
              {emailError}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (passwordError) {
                  setPasswordError("");
                }
              }}
              className={`w-full rounded-lg border bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${passwordError
                  ? "border-[hsl(0_80%_75%)] bg-[hsl(0_85%_98%)] focus:ring-[hsl(0_80%_75%)]"
                  : "border-input focus:ring-ring"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {passwordError && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-[hsl(0_75%_45%)]">
              <AlertCircle className="h-3.5 w-3.5" />
              {passwordError}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Sign In
        </button>
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background py-3 font-medium text-foreground transition-colors hover:bg-muted"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account yet?{" "}
          <Link href="/role-select" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
