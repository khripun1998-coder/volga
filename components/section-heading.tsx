import Link from "next/link";

export function SectionHeading({
  title,
  subtitle,
  href,
  linkLabel = "Смотреть все",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl font-semibold text-graphite md:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1.5 text-muted">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 whitespace-nowrap text-sm font-medium text-accent transition hover:text-accent-hover"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
