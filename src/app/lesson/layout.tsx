import type { Metadata } from "next";
import type { ReactNode } from "react";

// Lessons are per-user and sit behind sign-in, so keep them out of search results.
export const metadata: Metadata = {
  title: "Lesson",
  robots: { index: false, follow: false },
};

export default function LessonLayout({ children }: { children: ReactNode }) {
  return children;
}
