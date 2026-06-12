import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { salonAPI, categoryAPI, reviewAPI } from '../services/api';

const HERO_STATS = [
  { val: '4+', label: 'Cities' },
  { val: '10k+', label: 'Happy Clients' },
  { val: '50+', label: 'Expert Stylists' },
  { val: '4.9★', label: 'Avg. Rating' },
];

export default function Home() {
  const navigate = useNavigate();
  const [salons, setSalons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [realReviews, setRealReviews] = useState([]);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [salonsRes, categoriesRes] = await Promise.all([
          salonAPI.getAll(),
          categoryAPI.getAll()
        ]);
        
        const rawSalons = salonsRes || [];
        const featuredSalons = rawSalons.slice(0, 3);

        // Fetch reviews in parallel for featured salons
        const reviewsPromises = featuredSalons.map(s => 
          reviewAPI.getBySalon(s.id).catch(err => {
            console.error(`Failed to load reviews for salon ${s.id}`, err);
            return [];
          })
        );
        const reviewsResults = await Promise.all(reviewsPromises);

        const enrichedSalons = rawSalons.map(s => {
          const featuredIndex = featuredSalons.findIndex(fs => fs.id === s.id);
          if (featuredIndex !== -1) {
            const salonReviews = reviewsResults[featuredIndex] || [];
            const avgRating = salonReviews.length 
              ? (salonReviews.reduce((a, r) => a + r.rating, 0) / salonReviews.length).toFixed(1) 
              : '5.0';
            return {
              ...s,
              rating: avgRating,
              reviewCount: salonReviews.length,
            };
          }
          return {
            ...s,
            rating: '5.0',
            reviewCount: 0,
          };
        });

        // Collect all real reviews from featured salons to display
        const collectedReviews = [];
        reviewsResults.forEach((salonReviews, idx) => {
          const salonName = featuredSalons[idx]?.name || 'Salon';
          salonReviews.forEach(r => {
            collectedReviews.push({
              id: r.id,
              reviewText: r.reviewText,
              rating: r.rating,
              userName: r.userName || `User ${r.userId}`,
              createdAt: new Date(r.createdAt || Date.now()).toLocaleDateString('en-IN'),
              salonName: salonName,
            });
          });
        });

        setSalons(enrichedSalons);
        setCategories(categoriesRes || []);
        setRealReviews(collectedReviews);
      } catch (err) {
        console.error('Failed to load home page data from backend', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const featured = salons.slice(0, 3);

  // Default fallback static categories and reviews if database is empty/fresh
  const defaultCategories = [
    { id: 1, name: 'Hair', icon: '✂️' },
    { id: 2, name: 'Color', icon: '🎨' },
    { id: 3, name: 'Skin Care', icon: '✨' },
    { id: 4, name: 'Wellness', icon: '🌿' },
    { id: 5, name: 'Nails', icon: '💅' },
    { id: 6, name: 'Bridal', icon: '💍' },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  const mockReviews = [
    { id: 1, reviewText: 'Absolutely stunning balayage work. Elena is a true colour artist — my hair has never looked this good.', rating: 5.0, userName: 'Ayush S.', createdAt: '2026-06-08' },
    { id: 2, reviewText: 'Quick, precise cut and the hot towel shave was surprisingly relaxing. Will definitely be back.', rating: 4.5, userName: 'Marcus V.', createdAt: '2026-06-05' },
    { id: 3, reviewText: 'The Aromatherapy Facial left my skin glowing for almost a week. Highly recommended.', rating: 5.0, userName: 'Sophia P.', createdAt: '2026-06-01' },
  ];

  const displayReviews = realReviews.length > 0 ? realReviews.slice(0, 3) : mockReviews;

  return (
    <div className="bg-[#F7F6F3]">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-[#1C1C1A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #C9A96E 0%, transparent 60%)' }} />
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-24 lg:py-36 relative z-10">
          <p className="text-[#C9A96E] text-[11px] font-semibold uppercase tracking-[0.3em] mb-4">Premium Salon & Wellness</p>
          <h1 className="font-display text-white text-[3.5rem] lg:text-[5rem] font-light leading-[1.05] tracking-wide max-w-2xl">
            Discover Your<br /><em className="text-[#C9A96E] not-italic">Perfect Look</em>
          </h1>
          <p className="text-white/50 text-[15px] mt-6 max-w-md leading-relaxed">
            Book expert hair, skin, and wellness services at India's most celebrated luxury salons.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <button onClick={() => navigate('/salons')}
              className="bg-[#C9A96E] hover:bg-[#b8945a] text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-[#C9A96E]/20 text-[14px]">
              Book Appointment
            </button>
            <button onClick={() => navigate('/salons')}
              className="border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-medium px-6 py-3 rounded-xl transition-colors text-[14px]">
              Explore Salons
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/10">
            {HERO_STATS.map(s => (
              <div key={s.label}>
                <p className="font-display text-[2rem] font-light text-white leading-none">{s.val}</p>
                <p className="text-[11px] text-white/40 mt-1 font-medium uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <p className="text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-2">What We Offer</p>
        <h2 className="font-display text-[2rem] font-light text-[#1C1C1A] mb-8">Browse by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {displayCategories.map(c => (
            <button key={c.id} onClick={() => navigate('/salons')}
              className="bg-white border border-[#E8E6E1] rounded-2xl p-4 text-center hover:border-[#C9A96E] hover:shadow-md transition-all group">
              <div className="text-2xl mb-2">{c.image || c.icon || '✨'}</div>
              <p className="text-[12px] font-semibold text-[#1C1C1A] group-hover:text-[#C9A96E] transition-colors">{c.name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured Salons ──────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1">Our Locations</p>
            <h2 className="font-display text-[2rem] font-light text-[#1C1C1A]">Featured Salons</h2>
          </div>
          <Link to="/salons" className="text-[13px] font-semibold text-[#C9A96E] hover:underline">View all →</Link>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="w-8 h-8 rounded-full border border-t-[#C9A96E] animate-spin mx-auto"></div>
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-10 bg-white border border-[#E8E6E1] rounded-2xl">
            <p className="text-[13px] text-[#A09A91]">No salons available. Create one in the Admin dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(salon => (
              <Link key={salon.id} to={`/salons/${salon.id}`}
                className="bg-white rounded-2xl border border-[#E8E6E1] overflow-hidden hover:shadow-lg transition-all group">
                <div className="h-48 bg-gradient-to-br from-[#E8DFD0] to-[#D4C5B0] flex items-center justify-center">
                  <span className="font-display text-4xl text-[#6B5740] font-light opacity-60">{salon.name[0]}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-[#1C1C1A] group-hover:text-[#C9A96E] transition-colors">{salon.name}</h3>
                      <p className="text-[12px] text-[#A09A91] mt-0.5">{salon.city}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[13px] font-semibold text-[#C9A96E]">{salon.rating || 5.0}★</p>
                      <p className="text-[10px] text-[#A09A91]">{salon.reviewCount || 0} reviews</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#A09A91] mt-2 truncate">{salon.address}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {(salon.tags || ['Premium', 'Luxury']).map(t => (
                      <span key={t} className="text-[10px] font-medium text-[#6B6560] bg-[#F2F0EC] px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[11px] text-[#A09A91]">
                    <span>⏰ {salon.openingTime} – {salon.closingTime}</span>
                    <span className="font-semibold text-[#C9A96E] group-hover:underline">Book Now →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Reviews ──────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <div className="mb-8">
          <p className="text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1">Client Love</p>
          <h2 className="font-display text-[2rem] font-light text-[#1C1C1A]">What They Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayReviews.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-[#C9A96E] text-lg mb-2">{'★'.repeat(Math.floor(r.rating))}</p>
                <p className="text-[13px] text-[#4B4845] italic leading-relaxed">"{r.reviewText}"</p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#F0EDE8] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#E8DFD0] flex items-center justify-center text-[#6B5740] text-[11px] font-bold">{(r.userName || 'U')[0]}</div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#1C1C1A]">{r.userName}</p>
                    <p className="text-[10px] text-[#A09A91]">{r.createdAt}</p>
                  </div>
                </div>
                {r.salonName && (
                  <span className="text-[10px] text-[#C9A96E] bg-[#C9A96E]/10 px-2 py-0.5 rounded-md font-medium">{r.salonName}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 pb-16">
        <div className="bg-[#1C1C1A] rounded-3xl px-8 py-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #C9A96E 0%, transparent 50%)' }} />
          <p className="font-display text-white text-[2.5rem] font-light leading-tight relative z-10">
            Ready for your <em className="text-[#C9A96E] not-italic">transformation?</em>
          </p>
          <p className="text-white/50 mt-3 text-[14px] relative z-10">Book an appointment at any of our premium locations across India.</p>
          <button onClick={() => navigate('/salons')}
            className="mt-6 bg-[#C9A96E] hover:bg-[#b8945a] text-white font-semibold px-8 py-3 rounded-xl transition-all relative z-10 hover:shadow-lg">
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
}

