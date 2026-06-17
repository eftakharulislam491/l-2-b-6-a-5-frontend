import { GlobalLoadingScreen } from "@/components/ui/global-loading-screen";

export default function Loading() {
  return (
    <GlobalLoadingScreen
      message="Loading route..."
      description="Please wait while the next page is prepared."
    />
  );
}
