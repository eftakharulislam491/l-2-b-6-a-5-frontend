import { Badge } from "@/components/ui/badge";
import { formatOrderMoney } from "@/components/modules/user/order/order-utils";

type TopProduct = {
  id: string;
  name: string;
  sold: number;
  revenue: number;
  orderCount: number;
};

type TopProductsProps = {
  products: TopProduct[];
};

export function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Top Products</h3>
        <p className="text-sm text-slate-500">
          Ranked by revenue from recent orders.
        </p>
      </div>

      <div className="space-y-4">
        {products.length ? (
          products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <div>
                  <p className="line-clamp-2 font-medium text-slate-900">
                    {product.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {product.sold} units sold across {product.orderCount} orders
                  </p>
                </div>
              </div>

              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {formatOrderMoney(product.revenue)}
              </Badge>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
            Top-selling products will appear here after orders are placed.
          </div>
        )}
      </div>
    </div>
  );
}
