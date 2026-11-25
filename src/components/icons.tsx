import type { ReactNode } from "react";

export type IconName =
  | "flame"
  | "spark"
  | "play"
  | "speaker"
  | "check"
  | "x"
  | "book"
  | "review"
  | "user"
  | "chevron"
  | "target";

const shapes: Record<IconName, ReactNode> = {
  flame: (
    <path d="M12 21.5c3.3 0 5.8-2.3 5.8-5.4 0-2.2-1.1-3.8-2.6-5.4-1.3-1.4-2.4-2.8-3-4.5-.4 1.9-1.2 3.2-2.1 4.2-1.4 1.6-2.6 3.4-2.6 5.7 0 3.1 2.5 5.4 5.5 5.4Z" />
  ),
  spark: (
    <>
      <path d="M12 3.5 13.8 8l4.7 1.6-4.7 1.6L12 15.7l-1.8-4.5L5.5 9.6 10.2 8 12 3.5Z" />
      <path d="M18 16.5l.8 2 2 .8-2 .7-.8 2-.7-2-2-.7 2-.8.7-2Z" />
    </>
  ),
  play: <path d="M8.5 5.6v12.8L19 12 8.5 5.6Z" />,
  speaker: (
    <>
      <path d="M4 10v4h3l4 3.5v-11L7 10H4Z" />
      <path d="M14.5 9.4a3.6 3.6 0 0 1 0 5.2" />
      <path d="M17 7a7 7 0 0 1 0 10" />
    </>
  ),
  check: <path d="m5 12.8 4.6 4.6L19 6.6" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
  book: (
    <>
      <path d="M4 5.4A2.4 2.4 0 0 1 6.4 3H19v14.5H6.4A2.4 2.4 0 0 0 4 19.9V5.4Z" />
      <path d="M19 17.5V21H6.4" />
    </>
  ),
  review: (
    <>
      <path d="M20 12a8 8 0 1 1-2.4-5.7" />
      <path d="M20 4.5v5h-5" />
    </>
  ),
  user: (
    <>
      <path d="M12 11.8a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Z" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  chevron: <path d="m9.5 6 6 6-6 6" />,
  target: (
    <>
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path d="M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
      <path d="M12 13.4a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Z" />
    </>
  ),
};

export function Icon({
  name,
  size = 20,
  filled = false,
}: {
  name: IconName;
  size?: number;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[name]}
    </svg>
  );
}
