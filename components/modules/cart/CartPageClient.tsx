"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/components/providers/cart-provider";
import { useGlobalLoading } from "@/components/providers/global-loading-provider";
import { createAddress } from "@/services/address/createAddress";
import { initiatePayment } from "@/services/payment/initiatePayment";
import { verifyStripeSession } from "@/services/payment/verifyStripeSession";
import type {
  ICreateAddressPayload,
  UserAddress,
} from "@/services/address/address-types";
import { createOrder } from "@/services/order/createOrder";
import type { OrderSummary } from "@/services/order/order-types";
import { CartCheckoutPanel } from "./CartCheckoutPanel";
import { CartCompletePanel } from "./CartCompletePanel";
import { CartItemsPanel } from "./CartItemsPanel";
import { CartPageHeader } from "./CartPageHeader";
import { CartSummaryCard } from "./CartSummaryCard";
import { getCartSummary } from "./cart-utils";
import type {
  CartStep,
  CheckoutAddressFormState,
  CheckoutFormState,
} from "./types";

const EMPTY_ADDRESS_FORM: CheckoutAddressFormState = {
  label: "",
  recipient: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  isDefault: false,
};

function createInitialCheckoutForm(addresses: UserAddress[]): CheckoutFormState {
  const defaultAddress = addresses.find((address) => address.isDefault);

  return {
    paymentMethod: "CASH_ON_DELIVERY",
    addressMode: defaultAddress ? "default" : addresses.length ? "saved" : "new",
    selectedAddressId: defaultAddress?.id ?? addresses[0]?.id ?? "",
    newAddress: EMPTY_ADDRESS_FORM,
  };
}

function getOptionalValue(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue || undefined;
}

function buildAddressPayload(
  values: CheckoutAddressFormState,
): ICreateAddressPayload {
  return {
    street: values.street.trim(),
    city: values.city.trim(),
    isDefault: values.isDefault,
    ...(getOptionalValue(values.label)
      ? { label: getOptionalValue(values.label) }
      : {}),
    ...(getOptionalValue(values.recipient)
      ? { recipient: getOptionalValue(values.recipient) }
      : {}),
    ...(getOptionalValue(values.phone)
      ? { phone: getOptionalValue(values.phone) }
      : {}),
    ...(getOptionalValue(values.state)
      ? { state: getOptionalValue(values.state) }
      : {}),
    ...(getOptionalValue(values.zipCode)
      ? { zipCode: getOptionalValue(values.zipCode) }
      : {}),
    ...(getOptionalValue(values.country)
      ? { country: getOptionalValue(values.country) }
      : {}),
  };
}

type CompletedSummary = ReturnType<typeof getCartSummary>;

const MIN_STREET_LENGTH = 5;
const MIN_CITY_LENGTH = 2;
const BD_PHONE_REGEX = /^(?:\+8801\d{9}|01\d{9})$/;

function validateNewAddressPayload(payload: ICreateAddressPayload) {
  if (!payload.street || payload.street.length < MIN_STREET_LENGTH) {
    return "Street must be at least 5 characters long.";
  }

  if (!payload.city || payload.city.length < MIN_CITY_LENGTH) {
    return "City must be at least 2 characters long.";
  }

  if (payload.label && payload.label.length < 2) {
    return "Label must be at least 2 characters long.";
  }

  if (payload.recipient && payload.recipient.length < 2) {
    return "Recipient must be at least 2 characters long.";
  }

  if (payload.phone && !BD_PHONE_REGEX.test(payload.phone)) {
    return "Phone number must be valid (+8801XXXXXXXXX or 01XXXXXXXXX).";
  }

  return null;
}

type CartPageClientProps = {
  initialAddresses?: UserAddress[];
  addressError?: string | null;
};

export default function CartPageClient({
  initialAddresses = [],
  addressError = null,
}: CartPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, itemCount, isLoading, refreshCart } = useCart();
  const { withLoading } = useGlobalLoading();
  const [savedAddresses, setSavedAddresses] =
    useState<UserAddress[]>(initialAddresses);
  const [step, setStep] = useState<CartStep>("cart");
  const [checkoutForm, setCheckoutForm] =
    useState<CheckoutFormState>(() =>
      createInitialCheckoutForm(initialAddresses),
    );
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const isSubmittingOrderRef = useRef(false);
  const [completedSummary, setCompletedSummary] =
    useState<CompletedSummary | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderSummary | null>(null);
  const handledStripeSessionRef = useRef<string | null>(null);

  const summary = useMemo(() => getCartSummary(items), [items]);
  const defaultAddress = savedAddresses.find((address) => address.isDefault);
  const selectedSavedAddress = savedAddresses.find(
    (address) => address.id === checkoutForm.selectedAddressId,
  );
  const activeStep: CartStep =
    step === "complete"
      ? "complete"
      : !isLoading && items.length === 0
        ? "cart"
        : step;
  const summaryForDisplay =
    completedSummary && activeStep === "complete" ? completedSummary : summary;
  const paymentStatus = searchParams.get("payment");
  const stripeSessionId = searchParams.get("session_id");

  const clearStripeQueryParams = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("payment");
    nextParams.delete("session_id");
    nextParams.delete("order_id");
    const queryString = nextParams.toString();
    router.replace(queryString ? `/cart?${queryString}` : "/cart");
  }, [router, searchParams]);

  useEffect(() => {
    if (paymentStatus === "cancel") {
      toast.info("Stripe checkout was cancelled.");
      clearStripeQueryParams();
      return;
    }

    if (paymentStatus !== "success" || !stripeSessionId) {
      return;
    }

    if (handledStripeSessionRef.current === stripeSessionId) {
      return;
    }

    handledStripeSessionRef.current = stripeSessionId;

    void (async () => {
      const verificationResult = await withLoading(
        "Verifying Stripe payment...",
        async () => verifyStripeSession(stripeSessionId),
      );

      if (verificationResult.success) {
        toast.success(verificationResult.message);
        await refreshCart();
        router.refresh();
      } else {
        toast.error(verificationResult.message);
      }

      clearStripeQueryParams();
    })();
  }, [
    clearStripeQueryParams,
    paymentStatus,
    refreshCart,
    router,
    stripeSessionId,
    withLoading,
  ]);

  const updateCheckoutField = (
    field: keyof CheckoutFormState,
    value: CheckoutFormState[keyof CheckoutFormState],
  ) => {
    setCheckoutForm((currentState) => ({
      ...currentState,
      [field]: value,
      ...(field === "addressMode" && value === "default"
        ? { selectedAddressId: defaultAddress?.id ?? "" }
        : {}),
      ...(field === "addressMode" && value === "saved"
        ? {
            selectedAddressId:
              currentState.selectedAddressId || savedAddresses[0]?.id || "",
          }
        : {}),
    }));
  };

  const updateNewAddressField = <Field extends keyof CheckoutAddressFormState>(
    field: Field,
    value: CheckoutAddressFormState[Field],
  ) => {
    setCheckoutForm((currentState) => ({
      ...currentState,
      newAddress: {
        ...currentState.newAddress,
        [field]: value,
      },
    }));
  };

  const handleBack = () => {
    if (activeStep === "checkout") {
      setStep("cart");
      return;
    }

    if (activeStep === "complete") {
      setStep("checkout");
      setCompletedSummary(null);
      setCompletedOrder(null);
    }
  };

  const handleProceedToCheckout = () => {
    if (!items.length) {
      return;
    }

    setStep("checkout");
  };

  const handlePayNow = async () => {
    if (!items.length) {
      return;
    }

    if (isSubmittingOrderRef.current || isSubmittingOrder) {
      return;
    }

    let shippingAddressId: string | undefined;
    let shippingAddress: ICreateAddressPayload | undefined;

    if (checkoutForm.addressMode === "default") {
      if (!defaultAddress) {
        toast.error("You do not have a default address yet.");
        return;
      }

      shippingAddressId = defaultAddress.id;
    }

    if (checkoutForm.addressMode === "saved") {
      if (!selectedSavedAddress) {
        toast.error("Please select a saved address.");
        return;
      }

      shippingAddressId = selectedSavedAddress.id;
    }

    if (checkoutForm.addressMode === "new") {
      shippingAddress = buildAddressPayload(checkoutForm.newAddress);
      const addressValidationError = validateNewAddressPayload(shippingAddress);

      if (addressValidationError) {
        toast.error(addressValidationError);
        return;
      }
    }

    isSubmittingOrderRef.current = true;
    setIsSubmittingOrder(true);

    try {
      const result = await withLoading("Placing your order...", async () => {
        if (checkoutForm.addressMode === "new" && shippingAddress) {
          const addressResult = await createAddress(shippingAddress);

          if (!addressResult.success) {
            return {
              success: false,
              message: addressResult.message,
              order: null,
              orderId: null,
            };
          }

          setSavedAddresses(addressResult.addresses);
          shippingAddressId = addressResult.addressId ?? undefined;

          if (!shippingAddressId) {
            return {
              success: false,
              message: "Address created, but the server did not return an address id.",
              order: null,
              orderId: null,
            };
          }
        }

        return createOrder({
          shippingAddressId: shippingAddressId ?? "",
          paymentMethod: checkoutForm.paymentMethod,
          shippingCost: summary.shipping,
          tax: summary.tax,
        });
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      if (checkoutForm.paymentMethod === "STRIPE") {
        if (!result.orderId) {
          toast.error("Order was created but payment could not be started.");
          return;
        }

        const orderId = result.orderId;
        const paymentInitResult = await withLoading(
          "Redirecting to Stripe...",
          async () => initiatePayment(orderId),
        );

        if (!paymentInitResult.success) {
          toast.error(paymentInitResult.message);
          return;
        }

        if (
          paymentInitResult.requiresRedirect &&
          paymentInitResult.gatewayPageUrl
        ) {
          window.location.assign(paymentInitResult.gatewayPageUrl);
          return;
        }

        toast.error("Stripe did not return a checkout URL.");
        return;
      }

      setCompletedSummary(summary);
      setCompletedOrder(result.order);
      setStep("complete");
      toast.success(result.message);
      await refreshCart();
      router.refresh();
    } finally {
      isSubmittingOrderRef.current = false;
      setIsSubmittingOrder(false);
    }
  };

  const handleContinueShopping = () => {
    router.push("/products");
  };

  return (
    <div className="min-h-svh bg-white">
      <CartPageHeader step={activeStep} onBack={handleBack} />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {activeStep === "cart" ? (
              <CartItemsPanel
                items={items}
                itemCount={itemCount}
                isLoading={isLoading}
                onProceedToCheckout={handleProceedToCheckout}
              />
            ) : null}

            {activeStep === "checkout" ? (
              <CartCheckoutPanel
                itemCount={itemCount}
                values={checkoutForm}
                savedAddresses={savedAddresses}
                addressError={addressError}
                isSubmitting={isSubmittingOrder}
                onFieldChange={updateCheckoutField}
                onNewAddressFieldChange={updateNewAddressField}
                onBackToCart={() => setStep("cart")}
                onPayNow={() => void handlePayNow()}
              />
            ) : null}

            {activeStep === "complete" ? (
              <CartCompletePanel
                order={completedOrder}
                subtotal={summaryForDisplay.subtotal}
                shipping={summaryForDisplay.shipping}
                tax={summaryForDisplay.tax}
                total={summaryForDisplay.total}
                onBackToCart={() => setStep("cart")}
              />
            ) : null}
          </div>

          <aside className="lg:col-span-1">
            <CartSummaryCard
              step={activeStep}
              subtotal={summaryForDisplay.subtotal}
              shipping={summaryForDisplay.shipping}
              tax={summaryForDisplay.tax}
              total={summaryForDisplay.total}
              isLoading={isLoading}
              isSubmittingOrder={isSubmittingOrder}
              hasItems={items.length > 0}
              onProceedToCheckout={handleProceedToCheckout}
              onPayNow={() => void handlePayNow()}
              onContinueShopping={handleContinueShopping}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
