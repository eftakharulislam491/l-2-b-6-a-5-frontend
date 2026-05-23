"use client";

import { CreditCard, Home, MapPin, Plus, Truck } from "lucide-react";
import type { UserAddress } from "@/services/address/address-types";
import type { CheckoutAddressFormState, CheckoutFormState } from "./types";

type CartCheckoutPanelProps = {
  itemCount: number;
  values: CheckoutFormState;
  savedAddresses: UserAddress[];
  addressError?: string | null;
  isSubmitting?: boolean;
  onFieldChange: (
    field: keyof CheckoutFormState,
    value: CheckoutFormState[keyof CheckoutFormState],
  ) => void;
  onNewAddressFieldChange: <Field extends keyof CheckoutAddressFormState>(
    field: Field,
    value: CheckoutAddressFormState[Field],
  ) => void;
  onBackToCart: () => void;
  onPayNow: () => void;
};

function getAddressLocation(address: UserAddress) {
  return [address.city, address.state, address.zipCode].filter(Boolean).join(", ");
}

function AddressPreview({ address }: { address: UserAddress }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{address.label}</p>
          <div className="mt-2 space-y-1 text-sm text-slate-600">
            {address.recipient ? <p>{address.recipient}</p> : null}
            {address.phone ? <p>{address.phone}</p> : null}
            <p>{address.street}</p>
            {getAddressLocation(address) ? <p>{getAddressLocation(address)}</p> : null}
            {address.country ? <p>{address.country}</p> : null}
          </div>
        </div>
        {address.isDefault ? (
          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
            Default
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function CartCheckoutPanel({
  itemCount,
  values,
  savedAddresses,
  addressError = null,
  isSubmitting = false,
  onFieldChange,
  onNewAddressFieldChange,
  onBackToCart,
  onPayNow,
}: CartCheckoutPanelProps) {
  const defaultAddress = savedAddresses.find((address) => address.isDefault);
  const selectedAddress = savedAddresses.find(
    (address) => address.id === values.selectedAddressId,
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-slate-700" />
          <h2 className="text-base font-semibold text-slate-900">Checkout</h2>
        </div>
        <span className="text-xs font-medium text-slate-500">
          {itemCount} item{itemCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="border-t border-slate-100 p-5">
        <div className="grid gap-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-slate-700" />
                <p className="text-sm font-semibold text-slate-900">
                  Delivery address
                </p>
              </div>
              <p className="text-xs text-slate-500">
                Select saved, default, or new
              </p>
            </div>

            {addressError ? (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                {addressError}
              </div>
            ) : null}

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition ${
                  values.addressMode === "default"
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:bg-slate-50"
                } ${!defaultAddress ? "cursor-not-allowed opacity-60" : ""}`}
              >
                <input
                  type="radio"
                  name="addressMode"
                  checked={values.addressMode === "default"}
                  disabled={!defaultAddress}
                  onChange={() => onFieldChange("addressMode", "default")}
                  className="mt-1"
                />
                <span>
                  <span className="flex items-center gap-2 font-semibold text-slate-900">
                    <Home className="h-4 w-4" />
                    Default address
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {defaultAddress
                      ? "Use your saved default address."
                      : "No default address saved."}
                  </span>
                </span>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition ${
                  values.addressMode === "saved"
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:bg-slate-50"
                } ${savedAddresses.length === 0 ? "cursor-not-allowed opacity-60" : ""}`}
              >
                <input
                  type="radio"
                  name="addressMode"
                  checked={values.addressMode === "saved"}
                  disabled={savedAddresses.length === 0}
                  onChange={() => onFieldChange("addressMode", "saved")}
                  className="mt-1"
                />
                <span>
                  <span className="flex items-center gap-2 font-semibold text-slate-900">
                    <MapPin className="h-4 w-4" />
                    Saved address
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Select one of your saved addresses.
                  </span>
                </span>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition ${
                  values.addressMode === "new"
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="addressMode"
                  checked={values.addressMode === "new"}
                  onChange={() => onFieldChange("addressMode", "new")}
                  className="mt-1"
                />
                <span>
                  <span className="flex items-center gap-2 font-semibold text-slate-900">
                    <Plus className="h-4 w-4" />
                    New address
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Create and use a new address.
                  </span>
                </span>
              </label>
            </div>

            {values.addressMode === "default" && defaultAddress ? (
              <div className="mt-4">
                <AddressPreview address={defaultAddress} />
              </div>
            ) : null}

            {values.addressMode === "saved" ? (
              <div className="mt-4 grid gap-3">
                {savedAddresses.length ? (
                  savedAddresses.map((address) => (
                    <label
                      key={address.id}
                      className={`cursor-pointer rounded-xl border p-4 transition ${
                        values.selectedAddressId === address.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="savedAddress"
                          checked={values.selectedAddressId === address.id}
                          onChange={() =>
                            onFieldChange("selectedAddressId", address.id)
                          }
                          className="mt-1"
                        />
                        <div className="min-w-0 flex-1">
                          <AddressPreview address={address} />
                        </div>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                    You do not have any saved addresses yet. Choose new address
                    to create one during checkout.
                  </p>
                )}

                {selectedAddress ? null : savedAddresses.length ? (
                  <p className="text-xs text-amber-700">Please select an address.</p>
                ) : null}
              </div>
            ) : null}

            {values.addressMode === "new" ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-800">Label</label>
                  <input
                    value={values.newAddress.label}
                    onChange={(event) =>
                      onNewAddressFieldChange("label", event.target.value)
                    }
                    className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="Home, Office"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-800">
                    Recipient
                  </label>
                  <input
                    value={values.newAddress.recipient}
                    onChange={(event) =>
                      onNewAddressFieldChange("recipient", event.target.value)
                    }
                    className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="Recipient name"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-800">Phone</label>
                  <input
                    value={values.newAddress.phone}
                    onChange={(event) =>
                      onNewAddressFieldChange("phone", event.target.value)
                    }
                    className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="+880 1xxx..."
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-800">
                    Country
                  </label>
                  <input
                    value={values.newAddress.country}
                    onChange={(event) =>
                      onNewAddressFieldChange("country", event.target.value)
                    }
                    className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="Bangladesh"
                  />
                </div>

                <div className="grid gap-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-800">
                    Street <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={values.newAddress.street}
                    onChange={(event) =>
                      onNewAddressFieldChange("street", event.target.value)
                    }
                    className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="House, road, area"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-800">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={values.newAddress.city}
                    onChange={(event) =>
                      onNewAddressFieldChange("city", event.target.value)
                    }
                    className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="Dhaka"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-800">State</label>
                  <input
                    value={values.newAddress.state}
                    onChange={(event) =>
                      onNewAddressFieldChange("state", event.target.value)
                    }
                    className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="Dhaka"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-800">
                    Zip code
                  </label>
                  <input
                    value={values.newAddress.zipCode}
                    onChange={(event) =>
                      onNewAddressFieldChange("zipCode", event.target.value)
                    }
                    className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="1219"
                  />
                </div>

                <label className="flex items-center gap-3 self-end text-sm font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={values.newAddress.isDefault}
                    onChange={(event) =>
                      onNewAddressFieldChange("isDefault", event.target.checked)
                    }
                  />
                  Save as default address
                </label>
              </div>
            ) : null}
          </div>

        </div>

        <div className="mt-6 rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-slate-700" />
              <p className="text-sm font-semibold text-slate-900">Payment method</p>
            </div>
            <p className="text-xs text-slate-500">Secure checkout</p>
          </div>

          <div className="mt-4 grid gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm transition hover:bg-slate-50">
              <input
                type="radio"
                name="payment"
                checked={values.paymentMethod === "CASH_ON_DELIVERY"}
                onChange={() =>
                  onFieldChange("paymentMethod", "CASH_ON_DELIVERY")
                }
              />
              <span className="font-medium text-slate-900">Cash on delivery</span>
              <span className="ml-auto text-xs text-slate-500">Pay at door</span>
            </label>

            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm transition hover:bg-slate-50">
              <input
                type="radio"
                name="payment"
                checked={values.paymentMethod === "STRIPE"}
                onChange={() => onFieldChange("paymentMethod", "STRIPE")}
              />
              <span className="font-medium text-slate-900">Stripe</span>
              <span className="ml-auto text-xs text-slate-500">Card / Wallet</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onBackToCart}
            className="h-11 flex-1 rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Back to cart
          </button>

          <button
            type="button"
            onClick={onPayNow}
            disabled={isSubmitting}
            className={`h-11 flex-1 rounded-md text-sm font-semibold text-white transition active:scale-[0.99] ${
              isSubmitting
                ? "cursor-not-allowed bg-blue-300"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Placing order..." : "Pay now"}
          </button>
        </div>
      </div>
    </div>
  );
}
