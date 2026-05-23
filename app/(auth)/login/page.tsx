import Link from "next/link";
import AuthImage from "@/components/modules/auth/AuthImage";
import { GalleryVerticalEnd } from "lucide-react";
import LoginForm from "@/components/modules/auth/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex flex-col p-6 md:p-10">
        {/* Brand */}
        <Link href="/" className="flex w-fit items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white">
            <GalleryVerticalEnd className="h-5 w-5 text-slate-800" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-slate-900">
            Metro
          </span>
        </Link>

        {/* Centered content */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Login to your account
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Enter your email below to login to your account
              </p>
            </div>

            <div className="mt-8">
              {/* Your existing form component */}
              <LoginForm />
            </div>

            {/* Bottom link */}
            <p className="mt-6 text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer (optional) */}
        <p className="mt-6 text-center text-xs text-slate-400">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>

      {/* Right: Image */}
      <AuthImage />
    </div>
  );
}
