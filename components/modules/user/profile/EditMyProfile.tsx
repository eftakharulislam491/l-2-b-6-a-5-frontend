import React from "react";

export default function EditMyProfile() {
  const inputClassName =
    "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground transition focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30";

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="rounded-t-lg border border-b-0 border-border bg-card px-6 py-4 text-card-foreground">
        <h1 className="text-xl font-semibold">My Profile</h1>
      </div>

      <div className="rounded-b-lg border border-border bg-card p-6 text-card-foreground">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Email Field */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              defaultValue="admin@email.com"
              className={inputClassName}
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Phone <span className="text-destructive">*</span>
            </label>
            <input
              type="tel"
              defaultValue="12345678"
              className={inputClassName}
            />
          </div>

          {/* First Name Field */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              First Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              defaultValue="Demo"
              className={inputClassName}
            />
          </div>

          {/* Last Name Field */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Last Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              defaultValue="Admin"
              className={inputClassName}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              type="password"
              className={inputClassName}
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <input
              type="password"
              className={inputClassName}
            />
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="mt-6">
          <button className="rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
