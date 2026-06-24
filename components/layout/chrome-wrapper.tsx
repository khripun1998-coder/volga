export function ChromeWrapper({
  sidebar,
  header,
  footer,
  children,
}: {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-2.5rem)]">
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        {header}
        <main id="main" className="flex-1 pb-24 md:pb-0">{children}</main>
        {footer}
      </div>
    </div>
  );
}
