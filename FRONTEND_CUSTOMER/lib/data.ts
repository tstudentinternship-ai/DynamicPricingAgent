import type { Product } from "@/types/product";

/**
 * DATA-FETCHING ABSTRACTION LAYER
 * ---------------------------------------------------------------------------
 * This file is the ONLY place in the app that knows where product data
 * comes from. Every page/component calls `getProducts(category)` and never
 * talks to the API or any data source directly.
 *
 * Source: a FastAPI service backed by a Supabase view ("customer_facing_items"),
 * which itself reads from the live "products_sku" table. Prices, expiry, and
 * markdown flags can change at any time (an hourly pricing job updates them),
 * so this function intentionally does NOT cache for long — `revalidate: 60`
 * below means Next.js will re-fetch at most once a minute.
 *
 * The function signature and return type (Promise<Product[]>) are stable,
 * so swapping the underlying API/DB later requires no changes outside this
 * file.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Shape of a single row as returned by GET /customer-items and
// GET /customer-items/category/{item_category}.
interface CustomerFacingItem {
  sku_id: string;
  item_name: string;
  item_category: string;
  unit: string;
  time_to_expire: number;
  old_price?: number;
  new_price: number;
  show_old_price: boolean;
  image_url: string;
  description?: string;
  protein?: string;
  carbohydrate?: string;
  calories?: string;
}

// Categories this app knows how to render. Kept here (not derived from the
// API) so isValidCategory() can respond instantly without a network call.
const KNOWN_CATEGORIES = ["meat", "bakery"];

/**
 * Converts one raw API row into the shape every component in this app
 * actually consumes. This is the one place that absorbs the naming/typing
 * differences between the Supabase view and the frontend's Product type.
 */
function mapToProduct(item: CustomerFacingItem): Product {
  return {
    id: item.sku_id,
    name: item.item_name,
    unit: item.unit,
    price: item.new_price,
    imageUrl: item.image_url,
    category: item.item_category,
    daysUntilExpiry: Math.round(item.time_to_expire),
    oldPrice: item.show_old_price ? item.old_price : undefined,
    showOldPrice: item.show_old_price,
    description: item.description,
    protein: item.protein,
    carbs: item.carbohydrate,
    calories: item.calories,
  };
}

/**
 * Returns the list of products for a given category slug by calling the
 * FastAPI service's category endpoint directly — the filtering happens at
 * the database level, so this never has to fetch all products and filter
 * client-side.
 *
 * Returns an empty array for unknown/invalid categories or any fetch
 * failure, so callers can render a clean "not found" state rather than
 * crashing.
 */
export async function getProducts(category: string): Promise<Product[]> {
  if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_API_BASE_URL is not set");
    return [];
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/customer-items/category/${category}`,
      { next: { revalidate: 60 } } // re-fetch at most once a minute
    );

    if (!res.ok) {
      // Covers the API's 404 for an unknown category, and any 5xx.
      return [];
    }

    const json: { success: boolean; data: CustomerFacingItem[] } = await res.json();
    return json.data.map(mapToProduct);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
}

/**
 * Returns a single product by SKU, used by the product detail page
 * (/aisle/[category]/[sku]). Calls the FastAPI single-item endpoint
 * directly rather than fetching the whole category and filtering, so a
 * detail page never needs to load more data than it shows.
 *
 * Returns null if the SKU doesn't exist or the request fails, so the
 * page can render a clean "product not found" state.
 */
export async function getProductBySku(sku: string): Promise<Product | null> {
  if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_API_BASE_URL is not set");
    return null;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/customer-items/${sku}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const json: { success: boolean; data: CustomerFacingItem } = await res.json();
    return mapToProduct(json.data);
  } catch (err) {
    console.error("Failed to fetch product:", err);
    return null;
  }
}

/**
 * Returns true if the given category slug is one this app knows how to
 * render. Checked locally (not via the API) so the "category not found"
 * page renders instantly without waiting on a network round trip.
 */
export function isValidCategory(category: string): boolean {
  return KNOWN_CATEGORIES.includes(category);
}