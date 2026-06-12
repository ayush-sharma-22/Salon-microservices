import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { notificationAPI, salonAPI } from '../services/api';

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    let active = true;

    async function fetchNotifications() {
      try {
        let count = 0;
        // Fetch user notifications
        const userNotes = await notificationAPI.getByUser(user.id);
        count += (userNotes || []).filter(n => !n.isRead && !n.read).length;

        // If owner, fetch salon notifications
        if (user.role === 'OWNER') {
          const ownedSalon = await salonAPI.getOwned();
          if (ownedSalon) {
            const salonNotes = await notificationAPI.getBySalon(ownedSalon.id);
            count += (salonNotes || []).filter(n => !n.isRead && !n.read).length;
          }
        }

        if (active) {
          setUnreadCount(count);
        }
      } catch (err) {
        console.error('Failed to fetch unread notification count in navbar', err);
      }
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [user]);

  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null; // Admin has its own nav

  const links = [
    { to: '/', label: 'Home' },
    { to: '/salons', label: 'Salons' },
  ];

  return (
    <nav className="bg-[#1C1C1A] sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-[#C9A96E] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">A</span>
          </div>
          <div className="leading-tight">
            <p className="font-display text-white text-[20px] font-light tracking-widest leading-none">Aura</p>
            <p className="text-[9px] text-white/40 font-medium uppercase tracking-[0.2em]">Luxury Salon</p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-[13px] font-medium transition-colors ${location.pathname === l.to ? 'text-[#C9A96E]' : 'text-white/55 hover:text-white'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notification Bell */}
              <Link to="/profile" className="relative p-1.5 text-white/55 hover:text-white transition-colors mr-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 min-w-[16px] h-[16px] bg-[#C9A96E] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <Link to="/my-bookings" className="hidden sm:block text-[12px] font-medium text-white/55 hover:text-white transition-colors">My Bookings</Link>
              <div className="relative">
                <button onClick={() => setMenuOpen(o => !o)} className="w-8 h-8 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/40 flex items-center justify-center text-[#C9A96E] text-[11px] font-bold">
                  {(user.fullName || user.username || 'U')[0]}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-10 bg-white border border-[#E8E6E1] rounded-xl shadow-xl w-44 py-2 z-50">
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-[13px] text-[#1C1C1A] hover:bg-[#FAFAF8]">Profile</Link>
                    <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-[13px] text-[#1C1C1A] hover:bg-[#FAFAF8]">My Bookings</Link>
                    {user.role === 'OWNER' && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-[13px] text-[#1C1C1A] hover:bg-[#FAFAF8]">Admin Panel</Link>
                    )}
                    <hr className="my-1 border-[#F0EDE8]" />
                    <button onClick={() => { onLogout(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-[13px] text-red-500 hover:bg-[#FAFAF8]">Sign out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button onClick={() => navigate('/login')}
              className="bg-[#C9A96E] hover:bg-[#b8945a] text-white text-[12px] font-semibold px-4 py-2 rounded-lg transition-colors">
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
