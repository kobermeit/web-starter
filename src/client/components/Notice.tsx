import type { ReactNode } from "react";

interface NoticeProps {
  title: string;
  children?: ReactNode;
}

/** A centred full-page message, such as not found or offline, with optional text and actions below the title. */
export function Notice({ title, children }: NoticeProps) {
  return (
    <section className="flex flex-col items-center gap-3 py-16 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
