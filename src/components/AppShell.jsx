export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),transparent_32%),#f6faf2] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        {children}
      </div>
    </div>
  );
}