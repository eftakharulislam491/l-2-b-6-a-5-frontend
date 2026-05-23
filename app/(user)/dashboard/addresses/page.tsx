import MyAddress from "@/components/modules/user/address/MyAddress";
import { getAddress } from "@/services/address/getAddress";

export default async function AddressesPage() {
  const { addresses, error } = await getAddress();

  return (
    <div>
      <MyAddress initialAddresses={addresses} initialError={error} />
    </div>
  );
}
