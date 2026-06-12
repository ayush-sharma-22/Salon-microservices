import { Link, useLocation, useNavigate } from 'react-router-dom';

const ADMIN_NAV = [
  { id: 'overview',    label: 'Overview',        path: '/admin' },
  { id: 'bookings',   label: 'Bookings',        path: '/admin/bookings' },
  { id: 'services',   label: 'Services',        path: '/admin/services' },
  { id: 'salons',     label: 'Salons',          path: '/admin/salons' },
  { id: 'reviews',    label: 'Reviews',         path: '/admin/reviews' },
  { id: 'infra',      label: 'Infrastructure',  path: '/admin/infra' },
];

export default function AdminNav({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="bg-[#1C1C1A] sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#C9A96E] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <div className="leading-tight">
              <p className="font-display text-white text-[18px] font-light tracking-widest leading-none">Aura</p>
              <p className="text-[9px] text-white/40 font-medium uppercase tracking-[0.2em]">Admin Console</p>
            </div>
          </Link>
          <span className="hidden sm:block text-white/20 text-xs">|</span>
          <Link to="/" className="hidden sm:block text-[11px] text-white/40 hover:text-white transition-colors">← Customer Site</Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-[#1A6645] bg-[#EBF5F0] border border-[#b3deca] px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            10 Services Online
          </div>
          {user && (
            <button onClick={onLogout} className="text-[11px] text-white/40 hover:text-white transition-colors">Sign out</button>
          )}
          <div className="w-8 h-8 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/40 flex items-center justify-center text-[#C9A96E] text-[11px] font-bold">A</div>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 flex items-center gap-1 overflow-x-auto">
          {ADMIN_NAV.map(n => {
            const active = location.pathname === n.path;
            return (
              <Link key={n.id} to={n.path}
                className={`relative px-4 py-3 text-[13px] font-medium transition-colors whitespace-nowrap flex-shrink-0 ${active ? 'text-white' : 'text-white/40 hover:text-white/70'}`}>
                {n.label}
                {active && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A96E] rounded-t-full" />}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
