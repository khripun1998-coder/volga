import { cn } from "@/lib/utils";

export function DashShell({
  title,
  role,
  nav,
  children,
}: {
  title: string;
  role: string;
  nav: { label: string; href: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="container-page py-8">
      <div className="mb-7">
        <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
          {role}
        </span>
        <h1 className="font-display mt-3 text-3xl font-semibold text-graphite md:text-4xl">
          {title}
        </h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav className="flex flex-wrap gap-1 lg:flex-col">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-graphite/80 transition hover:bg-cream hover:text-accent"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 space-y-12">{children}</div>
      </div>
    </div>
  );
}

export function DashSection({
  id,
  title,
  action,
  children,
}: {
  id: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold text-graphite">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-1.5 font-display text-[26px] font-semibold leading-none text-graphite">
        {value}
      </div>
      {hint && <div className="mt-2 text-xs text-muted">{hint}</div>}
    </div>
  );
}

const tones: Record<string, string> = {
  default: "bg-cream text-muted border-line",
  green: "bg-sage/10 text-sage border-sage/30",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-accent-soft text-accent border-accent/20",
  red: "bg-red-50 text-red-700 border-red-200",
};

export function StatusPill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-2xl border border-line bg-paper", className)} {...props} />
  );
}
