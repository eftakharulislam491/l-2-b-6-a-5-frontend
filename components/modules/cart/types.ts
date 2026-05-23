export type CartStep = "cart" | "checkout" | "complete";

export type PaymentMethod = "CASH_ON_DELIVERY" | "STRIPE";

export type CheckoutAddressMode = "default" | "saved" | "new";

export type CheckoutAddressFormState = {
  label: string;
  recipient: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

export type CheckoutFormState = {
  paymentMethod: PaymentMethod;
  addressMode: CheckoutAddressMode;
  selectedAddressId: string;
  newAddress: CheckoutAddressFormState;
};
