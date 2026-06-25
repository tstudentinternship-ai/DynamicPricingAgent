"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import AdBanner from "./AdBanner";
import SearchBar from "./SearchBar";
import ProductGrid from "./ProductGrid";

interface AisleViewProps {
  products: Product[];
  bannerImageUrl: string;
  bannerAlt: string;
}

export default function AisleView({
  products,
  bannerImageUrl,
  bannerAlt,
}: AisleViewProps) {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(normalized)
    );
  }, [products, query]);

  return (
    <>
      <AdBanner imageUrl={bannerImageUrl} alt={bannerAlt} />

      <div className="flex justify-center px-4 py-4">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <p className="px-4 py-10 text-center text-sm text-gray-500">
          No products match &quot;{query}&quot;.
        </p>
      )}
    </>
  );
}