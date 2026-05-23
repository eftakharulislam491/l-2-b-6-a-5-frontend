"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { useGlobalLoading } from "@/components/providers/global-loading-provider";
import { createAddress } from "@/services/address/createAddress";
import { deleteAddress } from "@/services/address/deleteAddress";
import { updateAddress } from "@/services/address/updateAddress";
import type {
  ICreateAddressPayload,
  UserAddress,
} from "@/services/address/address-types";

type AddressFormValues = {
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

type FormMode = "create" | "edit";

type MyAddressProps = {
  initialAddresses?: UserAddress[];
  initialError?: string | null;
};

const EMPTY_FORM: AddressFormValues = {
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

function toFormValues(address: UserAddress): AddressFormValues {
  return {
    label: address.label,
    recipient: address.recipient,
    phone: address.phone,
    street: address.street,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    country: address.country,
    isDefault: address.isDefault,
  };
}

function getOptionalValue(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue || undefined;
}

function buildAddressPayload(values: AddressFormValues): ICreateAddressPayload {
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

function getAddressLocation(address: UserAddress) {
  return [address.city, address.state, address.zipCode].filter(Boolean).join(", ");
}

export default function MyAddress({
  initialAddresses = [],
  initialError = null,
}: MyAddressProps) {
  const router = useRouter();
  const { withLoading } = useGlobalLoading();
  const [addresses, setAddresses] = useState<UserAddress[]>(initialAddresses);
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<AddressFormValues>(EMPTY_FORM);

  const isFormOpen = Boolean(formMode);

  function updateField<Field extends keyof AddressFormValues>(
    field: Field,
    value: AddressFormValues[Field],
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  function openCreateForm() {
    setFormMode("create");
    setEditingAddressId(null);
    setFormValues(EMPTY_FORM);
  }

  function openEditForm(address: UserAddress) {
    setFormMode("edit");
    setEditingAddressId(address.id);
    setFormValues(toFormValues(address));
  }

  function closeForm() {
    setFormMode(null);
    setEditingAddressId(null);
    setFormValues(EMPTY_FORM);
  }

  async function handleSubmit() {
    const payload = buildAddressPayload(formValues);

    if (!payload.street) {
      toast.error("Street address is required.");
      return;
    }

    if (!payload.city) {
      toast.error("City is required.");
      return;
    }

    if (formMode === "edit" && !editingAddressId) {
      toast.error("Address id is missing.");
      return;
    }

    const result = await withLoading(
      formMode === "edit" ? "Updating address..." : "Creating address...",
      () =>
        formMode === "edit" && editingAddressId
          ? updateAddress(editingAddressId, payload)
          : createAddress(payload),
    );

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setAddresses(result.addresses);
    closeForm();
    toast.success(result.message);
    router.refresh();
  }

  async function handleDelete(addressId: string) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this address?",
    );

    if (!shouldDelete) {
      return;
    }

    const result = await withLoading("Deleting address...", () =>
      deleteAddress(addressId),
    );

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setAddresses(result.addresses);
    toast.success(result.message);
    router.refresh();
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-gray-50 rounded-t-lg px-6 py-4 border  border-gray-200 border-b-0">
        <h1 className="text-xl font-semibold text-gray-900">My Addresses</h1>
      </div>

      <div className="bg-white p-6 border">
        {initialError ? (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {initialError}
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`relative border rounded-lg p-6 ${
                address.isDefault ? "border-blue-500 border-2" : "border-gray-200"
              }`}
            >
              {address.isDefault && (
                <div className="absolute -top-3 left-4">
                  <CheckCircle className="w-6 h-6 text-blue-500 fill-white" />
                </div>
              )}

              {address.isDefault && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-500 text-white">
                    Default
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  {address.label}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {address.recipient ? <p>{address.recipient}</p> : null}
                  {address.phone ? <p>{address.phone}</p> : null}
                  <p>{address.street}</p>
                  {getAddressLocation(address) ? (
                    <p>{getAddressLocation(address)}</p>
                  ) : null}
                  {address.country ? <p>{address.country}</p> : null}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => openEditForm(address)}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(address.id)}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {addresses.length === 0 && !initialError ? (
          <div className="mb-6 rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <h2 className="text-base font-semibold text-gray-900">
              No addresses yet
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add your first delivery address to make checkout faster.
            </p>
          </div>
        ) : null}

        {isFormOpen ? (
          <div className="mb-6 rounded-lg border border-gray-200 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                {formMode === "edit" ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close address form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-gray-700">
                Label
                <input
                  value={formValues.label}
                  onChange={(event) => updateField("label", event.target.value)}
                  placeholder="Home, Office"
                  className="h-10 rounded-md border border-gray-200 px-3 text-sm font-normal outline-none focus:border-gray-400"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-gray-700">
                Recipient
                <input
                  value={formValues.recipient}
                  onChange={(event) =>
                    updateField("recipient", event.target.value)
                  }
                  placeholder="Recipient name"
                  className="h-10 rounded-md border border-gray-200 px-3 text-sm font-normal outline-none focus:border-gray-400"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-gray-700">
                Phone
                <input
                  value={formValues.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="+880..."
                  className="h-10 rounded-md border border-gray-200 px-3 text-sm font-normal outline-none focus:border-gray-400"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-gray-700">
                Country
                <input
                  value={formValues.country}
                  onChange={(event) => updateField("country", event.target.value)}
                  placeholder="Bangladesh"
                  className="h-10 rounded-md border border-gray-200 px-3 text-sm font-normal outline-none focus:border-gray-400"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-gray-700 md:col-span-2">
                <span>
                  Street <span className="text-red-500">*</span>
                </span>
                <input
                  value={formValues.street}
                  onChange={(event) => updateField("street", event.target.value)}
                  placeholder="House, road, area"
                  className="h-10 rounded-md border border-gray-200 px-3 text-sm font-normal outline-none focus:border-gray-400"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-gray-700">
                <span>
                  City <span className="text-red-500">*</span>
                </span>
                <input
                  value={formValues.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder="Dhaka"
                  className="h-10 rounded-md border border-gray-200 px-3 text-sm font-normal outline-none focus:border-gray-400"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-gray-700">
                State
                <input
                  value={formValues.state}
                  onChange={(event) => updateField("state", event.target.value)}
                  placeholder="Dhaka"
                  className="h-10 rounded-md border border-gray-200 px-3 text-sm font-normal outline-none focus:border-gray-400"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-gray-700">
                Zip Code
                <input
                  value={formValues.zipCode}
                  onChange={(event) => updateField("zipCode", event.target.value)}
                  placeholder="1219"
                  className="h-10 rounded-md border border-gray-200 px-3 text-sm font-normal outline-none focus:border-gray-400"
                />
              </label>

              <label className="flex items-center gap-3 self-end text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formValues.isDefault}
                  onChange={(event) =>
                    updateField("isDefault", event.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                Set as default address
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void handleSubmit()}
                className="px-6 py-2.5 rounded-lg bg-gray-900 font-medium text-white transition-colors hover:bg-gray-700"
              >
                {formMode === "edit" ? "Update Address" : "Save Address"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-6 py-2.5 rounded-lg border border-gray-200 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {!isFormOpen ? (
          <button
            type="button"
            onClick={openCreateForm}
            className="px-6 py-2.5 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-colors"
          >
            Add New Address
          </button>
        ) : null}
      </div>
    </div>
  );
}
