import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1A] text-white/50 mt-20">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded bg-[#C9A96E] flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-display text-white text-[22px] font-light tracking-widest">Aura</span>
          </div>
          <p className="text-[13px] leading-relaxed max-w-xs">Premium salon & wellness services. Book your transformation today.</p>
          <p className="text-[11px] mt-4 font-mono">Spring Boot 3.3.5 · Java 21 · Microservices</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/30 mb-3">Navigate</p>
          {[['/', 'Home'], ['/salons', 'Salons'], ['/my-bookings', 'My Bookings'], ['/login', 'Sign In']].map(([to, label]) => (
            <Link key={to} to={to} className="block text-[13px] mb-2 hover:text-white transition-colors">{label}</Link>
          ))}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/30 mb-3">Contact</p>
          <p className="text-[13px] mb-1">info@aurasalon.com</p>
          <p className="text-[13px] mb-1">+91-11-4567-8900</p>
          <p className="text-[13px]">New Delhi · Mumbai · Bangalore · Kolkata</p>
        </div>
      </div>
      <div className="border-t border-white/5 py-4">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 flex justify-between text-[11px]">
          <span>&copy; {new Date().getFullYear()} Aura Salon. All rights reserved.</span>
          <span>Built by Ayush Sharma</span>
        </div>
      </div>
    </footer>
  );
}
