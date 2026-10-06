import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <span className="mono-tag text-xs uppercase text-accent">Hata 404</span>
      <h1 className="mt-6 font-display font-black uppercase text-5xl sm:text-7xl text-ivory">
        <span lang="en">Breakpoint</span>
        <br />
        bulunamadı.
      </h1>
      <p className="mt-6 max-w-sm text-text-dim">
        Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 rounded-md bg-ivory px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-accent"
      >
        Ana sayfaya dön
      </Link>
    </div>
  );
}
