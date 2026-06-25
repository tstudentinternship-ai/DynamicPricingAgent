import Image from "next/image";
import Link from "next/link";
import { getProductBySku, isValidCategory } from "@/lib/data";

interface ProductDetailPageProps {
    params: Promise<{ category: string; sku: string }>;
}

/**
 * Product detail page, e.g. /aisle/bakery/BAK001.
 *
 * Stays within the same category as its parent grid — there is still no
 * link to any other category anywhere on this page. The only navigation
 * available is the browser's back button.
 */
export default async function ProductDetailPage({
    params,
}: ProductDetailPageProps) {
    const { category, sku } = await params;

    if (!isValidCategory(category)) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
                <h1 className="text-xl font-semibold text-gray-800">
                    Category not found
                </h1>
            </main>
        );
    }

    const product = await getProductBySku(sku);

    if (!product || product.category.toLowerCase() !== category.toLowerCase()) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
                <h1 className="text-xl font-semibold text-gray-800">
                    Product not found
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    We couldn&apos;t find &quot;{sku}&quot; in this aisle.
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Top gap + back arrow */}
            <div className="relative h-12 w-full bg-white">
                <Link
                    href={`/aisle/${category}`}
                    aria-label="Back to category"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-700 transition hover:bg-gray-100"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                    >
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </Link>
            </div>

            {/* Product image — pushed down a bit further, shadow separates it from the page below */}
            <div className="relative mt-[1cm] h-[25vh] w-full bg-white shadow-md">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="100vw"
                    className="object-contain p-4"
                    priority
                />
            </div>

            <div className="px-4 py-5">
                {/* Price */}
                <p className="text-2xl font-bold text-emerald-700">
                    ${product.price.toFixed(2)}
                </p>
                {product.showOldPrice && product.oldPrice !== undefined && (
                    <p className="text-sm text-gray-400 line-through">
                        ${product.oldPrice.toFixed(2)}
                    </p>
                )}

                {/* Name (left) + unit (right), same line */}
                <div className="mt-3 flex items-baseline justify-between gap-2">
                    <h1 className="text-lg font-semibold text-gray-900">
                        {product.name}
                    </h1>
                    <span className="whitespace-nowrap text-sm font-medium text-gray-500">
                        {product.unit}
                    </span>
                </div>

                {/* Small product detail / description */}
                {product.description && (
                    <p className="mt-2 text-sm text-gray-600">{product.description}</p>
                )}

                {/* Nutrition highlights — protein for meat, carbs for bakery,
            calories shown for both regardless of category. */}
                {(() => {
                    const showProtein = product.category === "meat" && product.protein;
                    const showCarbs = product.category === "bakery" && product.carbs;
                    const showCalories = Boolean(product.calories);

                    if (!showProtein && !showCarbs && !showCalories) return null;

                    return (
                        <div className="mt-4 flex gap-4 rounded-lg bg-white p-3 ring-1 ring-gray-100">
                            {showProtein && (
                                <div>
                                    <p className="text-xs text-gray-400">Protein</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {product.protein}
                                    </p>
                                </div>
                            )}
                            {showCarbs && (
                                <div>
                                    <p className="text-xs text-gray-400">Carbs</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {product.carbs}
                                    </p>
                                </div>
                            )}
                            {showCalories && (
                                <div>
                                    <p className="text-xs text-gray-400">Calories</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {product.calories}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })()}
            </div>
        </main>
    );
}