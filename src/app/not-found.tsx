import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-7xl select-none">🎮</div>
      <h1 className="text-3xl font-extrabold text-white">Game Over</h1>
      <p className="text-gray-500">This page doesn&apos;t exist — level select failed.</p>
      <Link
        href="/"
        className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors"
      >
        Back to Rankings
      </Link>
    </div>
  );
}
