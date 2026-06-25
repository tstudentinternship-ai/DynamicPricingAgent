export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-lg font-semibold text-gray-800">
        In-Aisle Product Display
      </h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        This app is accessed by scanning a QR code at a specific aisle, e.g.{" "}
        <code className="rounded bg-gray-100 px-1">/aisle/meat</code> or{" "}
        <code className="rounded bg-gray-100 px-1">/aisle/bakery</code>.
      </p>
    </main>
  );
}
