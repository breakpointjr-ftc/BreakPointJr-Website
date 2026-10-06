import Image from "next/image";

// The team logo (public/logo.png). A 320px copy is served for small marks so
// the 2 MB original never loads for a 40px icon.
export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo-sm.png"
      alt="BreakPoint Jr. logosu"
      width={320}
      height={320}
      priority
      unoptimized
      className={`object-contain ${className}`}
    />
  );
}
