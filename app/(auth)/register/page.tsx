import Link from "next/link";
import AuthImage from "@/components/modules/auth/AuthImage";
import { GalleryVerticalEnd } from "lucide-react";
import RegisterForm from "@/components/modules/auth/register/RegisterForm";

export default function Registerpage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
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

        {/* Center */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Create an account
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Enter your information below to create your account
              </p>
            </div>

            <div className="mt-8">
              <RegisterForm />
            </div>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          By signing up, you agree to our Terms and Privacy Policy.
        </p>
      </div>

      <AuthImage />
    </div>
  );
}
