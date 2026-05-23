"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useGlobalLoading } from "@/components/providers/global-loading-provider";
import { toast } from "sonner";
import { addToCart } from "@/services/cart/addToCart";
import { getCart } from "@/services/cart/getCart";
import type { AddToCartPayload, CartItemSummary } from "@/services/cart/cart-types";

type CartContextValue = {
  items: CartItemSummary[];
  itemCount: number;
  isLoading: boolean;
  isUpdating: boolean;
  refreshCart: () => Promise<void>;
  addItem: (payload: AddToCartPayload) => Promise<boolean>;
};

const CartContext = createContext<CartContextValue | null>(null);
const FALLBACK_CART_CONTEXT: CartContextValue = {
  items: [],
  itemCount: 0,
  isLoading: false,
  isUpdating: false,
  refreshCart: async () => {},
  addItem: async () => false,
};

function waitForNextPaint() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

function getLoginRedirectHref() {
  if (typeof window === "undefined") {
    return "/login";
  }

  const currentPath = `${window.location.pathname}${window.location.search}`;

  if (!currentPath || currentPath === "/login") {
    return "/login";
  }

  return `/login?redirect=${encodeURIComponent(currentPath)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { withLoading } = useGlobalLoading();
  const [items, setItems] = useState<CartItemSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const refreshCart = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await getCart();

      if (result.error) {
        setItems([]);
        return;
      }

      setItems(result.items);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(
    async (payload: AddToCartPayload) => {
      if (isUpdating) {
        return false;
      }

      setIsUpdating(true);

      try {
        return await withLoading("Updating cart...", async () => {
          const result = await addToCart(payload);

          if (!result.success) {
            toast.error(result.message);

            if (result.requiresAuth) {
              router.push(getLoginRedirectHref());
            }

            return false;
          }

          await refreshCart();
          await waitForNextPaint();
          toast.success(result.message);
          return true;
        });
      } finally {
        setIsUpdating(false);
      }
    },
    [isUpdating, refreshCart, router, withLoading],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      isLoading,
      isUpdating,
      refreshCart,
      addItem,
    }),
    [addItem, isLoading, isUpdating, items, refreshCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    return FALLBACK_CART_CONTEXT;
  }

  return context;
}
