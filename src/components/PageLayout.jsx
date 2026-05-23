import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";

export default function PageLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),transparent_30%),#f8faf6] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {!isHome && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-zinc-200 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-zinc-50"
            >
              <Logo className="h-9 w-9" />
              ShareLoop
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-zinc-50"
              >
                ← Back
              </button>

              <Link
                to="/"
                className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
              >
                Home
              </Link>
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
