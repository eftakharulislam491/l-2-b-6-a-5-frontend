export interface ICreateAddressPayload {
  label?: string;
  recipient?: string;
  phone?: string;
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
}

export type IUpdateAddressPayload = Partial<ICreateAddressPayload>;

export type UserAddress = {
  id: string;
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

export type AddressMutationResult = {
  success: boolean;
  message: string;
  address: UserAddress | null;
  addressId: string | null;
  addresses: UserAddress[];
};

export type GetAddressResult = {
  addresses: UserAddress[];
  error: string | null;
};
