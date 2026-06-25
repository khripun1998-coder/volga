export function ChromeWrapper({
  sidebar,
  header,
  footer,
  bottomBar,
  children,
}: {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  footer?: React.ReactNode;
  bottomBar?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-2.5rem)]">
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col pb-24 md:pb-0">
        {header}
        <main id="main" className="flex-1">{children}</main>
        {footer}
      </div>
      {bottomBar}
    </div>
  );
}
