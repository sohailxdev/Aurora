import { StickyHeader } from "@/components/Custom/sticky-header";
import { ProductGrid } from "@/components/Custom/product-grid";

export default function Category() {
  return (
    <main className="bg-white">
      <StickyHeader />
      <div className="relative container mx-auto px-4 py-10">
        <ProductGrid />
      </div>
    </main>
  );
}
