import CartPageClient from "@/components/modules/cart/CartPageClient";
import { getAddress } from "@/services/address/getAddress";

export default async function CartPage() {
  const { addresses, error } = await getAddress();

  return <CartPageClient initialAddresses={addresses} addressError={error} />;
}
