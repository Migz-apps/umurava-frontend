"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { notify } from "@/lib/notify";
import { useAppDispatch, useAppSelector } from "@/store";
import { login } from "@/store/slices/authSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);
  
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextEmailError = validateEmail(email);
    const nextPasswordError = password ? "" : "Password is required";

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) {
      notify.error(nextEmailError || nextPasswordError);
      return;
    }

    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      notify.success("Welcome back!", undefined, true);
      router.push("/dashboard");
    }
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
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
