"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
