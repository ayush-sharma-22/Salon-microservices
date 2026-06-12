import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { salonAPI, serviceAPI, reviewAPI, categoryAPI } from '../services/api';

export default function SalonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');
  const [selCat, setSelCat] = useState('All');

  useEffect(() => {
    async function loadSalonData() {
      if (!id) return;
      try {
        const [salonData, servicesData, reviewsData, categoriesData] = await Promise.all([
          salonAPI.getById(id),
          serviceAPI.getBySalon(id),
          reviewAPI.getBySalon(id),
          categoryAPI.getAll()
        ]);
        setSalon(salonData);
        setServices(servicesData || []);
        setReviews(reviewsData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error('Failed to load salon details', err);
      } finally {
        setLoading(false);
      }
    }
    loadSalonData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border border-t-[#C9A96E] animate-spin mx-auto"></div>
          <p className="text-[12px] text-[#A09A91] mt-2">Loading salon details...</p>
        </div>
      </div>
    );
  }

  if (!salon) return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-[2rem] font-light text-[#1C1C1A]">Salon not found</p>
        <button onClick={() => navigate('/salons')} className="mt-4 text-[#C9A96E] hover:underline text-[13px]">← Back to salons</button>
      </div>
    </div>
  );

  const cats = ['All', ...new Set(services.map(s => {
    const c = categories.find(c => c.id === s.categoryId);
    return c?.name || 'Other';
  }))];

  const filtered = selCat === 'All' ? services : services.filter(s => {
    const c = categories.find(c => c.id === s.categoryId);
    return c?.name === selCat;
  });

  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '5.0';

  return (
    <div className="bg-[#F7F6F3] min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#E8DFD0] to-[#D4C5B0] h-56 flex items-center justify-center relative">
        <span className="font-display text-[6rem] text-[#6B5740] font-light opacity-25">{salon.name[0]}</span>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#F7F6F3] h-12" />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 -mt-8 relative z-10">
        {/* Salon Info Card */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm p-6 flex flex-col md:flex-row gap-6 justify-between">
          <div>
            <h1 className="font-display text-[2rem] font-light text-[#1C1C1A]">{salon.name}</h1>
            <p className="text-[13px] text-[#A09A91] mt-1">{salon.address}, {salon.city}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-[12px] text-[#6B6560]">
              <span>📞 {salon.phoneNumber}</span>
              <span>✉️ {salon.email}</span>
              <span>⏰ {salon.openingTime} – {salon.closingTime}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {(salon.tags || ['Premium', 'Luxury']).map(t => (
                <span key={t} className="text-[10px] font-medium text-[#6B6560] bg-[#F2F0EC] px-2 py-0.5 rounded-full border border-[#E8E6E1]">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-[#FAFAF8] rounded-xl px-8 py-4 border border-[#F0EDE8] text-center flex-shrink-0">
            <p className="font-display text-[2.5rem] font-light text-[#C9A96E] leading-none">{avgRating}</p>
            <p className="text-[#C9A96E] mt-1">{'★'.repeat(Math.floor(Number(avgRating) || 5))}</p>
            <p className="text-[11px] text-[#A09A91] mt-1">{reviews.length} reviews</p>
            <button onClick={() => navigate(`/book/${salon.id}`)}
              className="mt-4 bg-[#1C1C1A] hover:bg-[#C9A96E] text-white font-semibold px-6 py-2.5 rounded-xl text-[13px] transition-colors">
              Book Now
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 border-b border-[#E8E6E1]">
          {['services', 'reviews', 'info'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`relative px-5 py-3 text-[13px] font-medium capitalize transition-colors ${activeTab === t ? 'text-[#1C1C1A]' : 'text-[#A09A91] hover:text-[#6B6560]'}`}>
              {t === 'services' ? `Services (${services.length})` : t === 'reviews' ? `Reviews (${reviews.length})` : 'Info'}
              {activeTab === t && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A96E] rounded-t-full" />}
            </button>
          ))}
        </div>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="py-6 space-y-5">
            {/* Category filter */}
            {cats.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {cats.map(c => (
                  <button key={c} onClick={() => setSelCat(c)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${selCat === c ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]' : 'bg-white text-[#6B6560] border-[#E8E6E1] hover:border-[#C9A96E]'}`}>
                    {c}
                  </button>
                ))}
              </div>
            )}
            {filtered.length === 0 ? (
              <p className="text-[#A09A91] text-[13px] py-8 text-center bg-white border border-[#E8E6E1] rounded-2xl">No services cataloged for this branch yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(svc => (
                  <div key={svc.id} className="bg-white rounded-2xl border border-[#E8E6E1] p-5 hover:border-[#C9A96E] transition-all group shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#1C1C1A] group-hover:text-[#C9A96E] transition-colors">{svc.name}</h3>
                        <p className="text-[11px] text-[#A09A91] mt-1 leading-relaxed">{svc.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="font-display text-[1.5rem] font-light text-[#1C1C1A]">₹{svc.price.toLocaleString()}</p>
                        <p className="text-[10px] text-[#A09A91]">{svc.duration} min session</p>
                      </div>
                      <button onClick={() => navigate(`/book/${salon.id}?service=${svc.id}`)}
                        className="bg-[#1C1C1A] hover:bg-[#C9A96E] text-white text-[12px] font-semibold px-4 py-2 rounded-xl transition-colors">
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="py-6 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-[#A09A91] text-[13px] py-8 text-center bg-white border border-[#E8E6E1] rounded-2xl">No reviews yet for this salon.</p>
            ) : reviews.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E8DFD0] flex items-center justify-center text-[#6B5740] font-bold text-sm">{(r.userName || 'U')[0]}</div>
                    <div>
                      <p className="font-semibold text-[#1C1C1A] text-[13px]">{r.userName || `User ${r.userId}`}</p>
                      <p className="text-[10px] text-[#A09A91]">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-[#C9A96E] font-semibold text-[13px]">{r.rating}★</span>
                </div>
                <p className="text-[13px] text-[#4B4845] italic mt-3 leading-relaxed">"{r.reviewText}"</p>
              </div>
            ))}
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="py-6">
            <div className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ['Salon Name', salon.name],
                ['City', salon.city],
                ['Address', salon.address],
                ['Phone', salon.phoneNumber],
                ['Email', salon.email],
                ['Opening Hours', `${salon.openingTime} – ${salon.closingTime}`],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider">{label}</p>
                  <p className="text-[13px] text-[#1C1C1A] mt-1 font-medium">{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

