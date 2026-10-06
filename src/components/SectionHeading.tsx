"use client";

import { motion } from "framer-motion";

type Variant = "rise" | "drop" | "slice";

type SectionHeadingProps = {
  index: string;
  tag: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  variant?: Variant;
};

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEW = { once: true, margin: "-80px" } as const;

// Sliced layers: the same title twice, each clipped to one side of a slash,
// sliding together from opposite directions.
const CUT_A = "polygon(0 0, 56% 0, 44% 100%, 0 100%)";
const CUT_B = "polygon(56% 0, 100% 0, 100% 100%, 44% 100%)";

function WordMask({ words, variant }: { words: string[]; variant: "rise" | "drop" }) {
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial="hidden"
          whileInView="show"
          viewport={VIEW}
          className="-mt-[0.25em] inline-block overflow-hidden pb-[0.08em] pt-[0.25em] align-bottom"
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: variant === "rise" ? "110%" : "-110%", rotate: variant === "rise" ? 4 : -4 },
              show: { y: "0%", rotate: 0, transition: { duration: 0.9, delay: i * 0.07, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </motion.span>
      ))}
    </>
  );
}

export default function SectionHeading({
  index,
  tag,
  title,
  description,
  align = "left",
  variant = "rise",
}: SectionHeadingProps) {
  const center = align === "center";
  const words = title.split(" ");
  const titleClass =
    "font-display font-black uppercase text-[clamp(2.6rem,7vw,6rem)] leading-[1.02] tracking-tight text-ivory";

  return (
    <div className={center ? "mx-auto max-w-4xl text-center" : ""}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={VIEW}
        transition={{ duration: 0.6, ease: EASE }}
        className={`mb-7 flex items-center gap-4 ${center ? "justify-center" : ""}`}
      >
        <span className="number-tick text-sm font-semibold text-accent">{index}</span>
        <span className="slash-shape h-[14px] w-8 bg-accent" />
        <span className="mono-tag text-[11px] uppercase text-text-dim">{tag}</span>
      </motion.div>

      <h2 className={titleClass}>
        {variant === "slice" ? (
          <span className="relative block">
            <span className="sr-only">{title}</span>
            <motion.span
              aria-hidden="true"
              className="block"
              style={{ clipPath: CUT_A }}
              initial={{ x: -90, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={VIEW}
              transition={{ duration: 0.95, ease: EASE }}
            >
              {title}
            </motion.span>
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 block text-accent"
              style={{ clipPath: CUT_B }}
              initial={{ x: 90, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={VIEW}
              transition={{ duration: 0.95, ease: EASE }}
            >
              {title}
            </motion.span>
          </span>
        ) : (
          <>
            <span className="sr-only">{title}</span>
            <span aria-hidden="true">
              <WordMask words={words} variant={variant} />
            </span>
          </>
        )}
      </h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEW}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
          className={`mt-7 max-w-xl text-base leading-relaxed text-text-dim sm:text-lg ${
            center ? "mx-auto" : ""
          }`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
