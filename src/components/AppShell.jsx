export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        {children}
      </div>
    </div>
  );
}