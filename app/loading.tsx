import { GlobalLoadingScreen } from "@/components/ui/global-loading-screen";

export default function Loading() {
  return (
    <GlobalLoadingScreen
      message="Loading page..."
      description="Please wait while we fetch the latest data."
    >
      <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_42%),linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(248,250,252,0.92))]">
        <div className="mx-auto flex h-full w-full max-w-7xl gap-6 px-6 py-8">
          <div className="hidden w-[320px] shrink-0 rounded-[32px] border border-slate-200/80 bg-white/70 p-6 shadow-sm lg:block">
            <div className="h-8 w-40 rounded-full bg-slate-200/80" />
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="h-20 rounded-2xl bg-slate-200/75" />
              <div className="h-20 rounded-2xl bg-slate-200/75" />
              <div className="h-20 rounded-2xl bg-slate-200/75" />
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-12 rounded-2xl bg-slate-200/75" />
              <div className="h-12 rounded-2xl bg-slate-200/75" />
              <div className="h-12 rounded-2xl bg-slate-200/75" />
              <div className="h-12 rounded-2xl bg-slate-200/75" />
              <div className="h-12 rounded-2xl bg-slate-200/75" />
            </div>
          </div>

          <div className="min-w-0 flex-1 rounded-[32px] border border-slate-200/80 bg-white/72 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-3">
                <div className="h-8 w-52 rounded-full bg-slate-200/80" />
                <div className="h-4 w-80 max-w-full rounded-full bg-slate-200/70" />
              </div>
              <div className="flex gap-3">
                <div className="h-11 w-28 rounded-xl bg-slate-200/75" />
                <div className="h-11 w-28 rounded-xl bg-slate-200/75" />
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2 space-y-6">
                <div className="h-72 rounded-[28px] bg-slate-200/70" />
                <div className="h-80 rounded-[28px] bg-slate-200/70" />
              </div>
              <div className="space-y-6">
                <div className="h-56 rounded-[28px] bg-slate-200/70" />
                <div className="h-56 rounded-[28px] bg-slate-200/70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlobalLoadingScreen>
  );
}
