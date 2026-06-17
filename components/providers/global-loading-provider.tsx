"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { GlobalLoadingScreen } from "@/components/ui/global-loading-screen";

type LoadingState = {
  isLoading: boolean;
  message: string;
};

type GlobalLoadingContextValue = {
  isLoading: boolean;
  showLoading: (message?: string) => Promise<void>;
  hideLoading: () => void;
  withLoading: <Result>(
    message: string,
    task: () => Promise<Result> | Result,
  ) => Promise<Result>;
};

const DEFAULT_MESSAGE = "Working on it...";
const ROUTE_LOADING_EVENT = "furninest-route-loading:start";

const GlobalLoadingContext = createContext<GlobalLoadingContextValue | null>(null);
const FALLBACK_GLOBAL_LOADING_CONTEXT: GlobalLoadingContextValue = {
  isLoading: false,
  showLoading: async () => {},
  hideLoading: () => {},
  withLoading: async (_message, task) => await task(),
};

function waitForNextPaint() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

export function startGlobalRouteLoading(message = "Loading route...") {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(ROUTE_LOADING_EVENT, {
      detail: { message },
    }),
  );
}

function RouteLoadingEvents({
  showLoading,
  hideLoading,
}: Pick<GlobalLoadingContextValue, "showLoading" | "hideLoading">) {
  const pathname = usePathname();
  const isRouteLoadingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopRouteLoading = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (isRouteLoadingRef.current) {
      isRouteLoadingRef.current = false;
      hideLoading();
    }
  }, [hideLoading]);

  useEffect(() => {
    stopRouteLoading();
  }, [pathname, stopRouteLoading]);

  useEffect(() => {
    function startRouteLoading(message = "Loading route...") {
      if (!isRouteLoadingRef.current) {
        isRouteLoadingRef.current = true;
        void showLoading(message);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(stopRouteLoading, 8000);
    }

    function handleRouteLoadingEvent(event: Event) {
      const customEvent = event as CustomEvent<{ message?: string }>;

      startRouteLoading(customEvent.detail?.message);
    }

    function handleDocumentClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>("a[href]");

      if (!anchor || anchor.target || anchor.hasAttribute("download")) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);

      if (nextUrl.origin !== currentUrl.origin) {
        return;
      }

      const isSamePage =
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search;

      if (isSamePage) {
        return;
      }

      startRouteLoading();
    }

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener(ROUTE_LOADING_EVENT, handleRouteLoadingEvent);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener(ROUTE_LOADING_EVENT, handleRouteLoadingEvent);
      stopRouteLoading();
    };
  }, [showLoading, stopRouteLoading]);

  return null;
}

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: DEFAULT_MESSAGE,
  });
  const pendingCountRef = useRef(0);

  const showLoading = useCallback(async (message = DEFAULT_MESSAGE) => {
    pendingCountRef.current += 1;
    setLoadingState({
      isLoading: true,
      message,
    });
    await waitForNextPaint();
  }, []);

  const hideLoading = useCallback(() => {
    pendingCountRef.current = Math.max(0, pendingCountRef.current - 1);

    if (pendingCountRef.current === 0) {
      setLoadingState((current) => ({
        ...current,
        isLoading: false,
      }));
    }
  }, []);

  const withLoading = useCallback<GlobalLoadingContextValue["withLoading"]>(
    async (message, task) => {
      await showLoading(message);

      try {
        return await task();
      } finally {
        hideLoading();
      }
    },
    [hideLoading, showLoading],
  );

  const value = useMemo<GlobalLoadingContextValue>(
    () => ({
      isLoading: loadingState.isLoading,
      showLoading,
      hideLoading,
      withLoading,
    }),
    [hideLoading, loadingState.isLoading, showLoading, withLoading],
  );

  return (
    <GlobalLoadingContext.Provider value={value}>
      <RouteLoadingEvents showLoading={showLoading} hideLoading={hideLoading} />
      {children}
      {loadingState.isLoading ? (
        <GlobalLoadingScreen message={loadingState.message} />
      ) : null}
    </GlobalLoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);

  if (!context) {
    return FALLBACK_GLOBAL_LOADING_CONTEXT;
  }

  return context;
}
