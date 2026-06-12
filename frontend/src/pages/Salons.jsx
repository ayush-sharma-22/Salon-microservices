import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { salonAPI } from '../services/api';

export default function Salons() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All');

  useEffect(() => {
    async function loadSalons() {
      try {
        const data = await salonAPI.getAll();
        setSalons(data || []);
      } catch (err) {
        console.error('Failed to load salons', err);
      } finally {
        setLoading(false);
      }
    }
    loadSalons();
  }, []);

  const cities = ['All', ...new Set(salons.map(s => s.city))];

  const filtered = salons.filter(s => {
    const matchCity = city === 'All' || s.city === city;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSearch;
  });

  return (
    <div className="bg-[#F7F6F3] min-h-screen">
      {/* Sub-header */}
      <div className="bg-white border-b border-[#E8E6E1]">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-6">
          <h1 className="font-display text-[28px] font-light text-[#1C1C1A]">Our Salons</h1>
          <p className="text-[12px] text-[#A09A91] mt-1">{salons.length} premium locations across India</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search salons or addresses..."
            className="flex-1 min-w-[220px] bg-white border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] placeholder-[#A09A91] focus:outline-none focus:border-[#C9A96E]"
          />
          <div className="flex gap-2 flex-wrap">
            {cities.map(c => (
              <button key={c} onClick={() => setCity(c)}
                className={`px-4 py-2 rounded-xl text-[12px] font-semibold border transition-colors ${city === c ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]' : 'bg-white text-[#6B6560] border-[#E8E6E1] hover:border-[#C9A96E]'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Salon Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 rounded-full border border-t-[#C9A96E] animate-spin mx-auto"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#A09A91]">
            <p className="font-display text-[2rem] font-light">No salons found</p>
            <p className="text-[13px] mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {filtered.map(salon => (
              <Link key={salon.id} to={`/salons/${salon.id}`}
                className="bg-white rounded-2xl border border-[#E8E6E1] overflow-hidden hover:shadow-lg transition-all group">
                <div className="h-44 bg-gradient-to-br from-[#E8DFD0] to-[#D4C5B0] flex items-center justify-center relative">
                  <span className="font-display text-5xl text-[#6B5740] font-light opacity-40">{salon.name[0]}</span>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#C9A96E]">
                    {salon.rating || 5.0}★
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#1C1C1A] group-hover:text-[#C9A96E] transition-colors">{salon.name}</h3>
                  <p className="text-[12px] text-[#A09A91] mt-0.5 truncate">{salon.address}</p>
                  <p className="text-[11px] font-semibold text-[#6B6560] mt-1">{salon.city}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {(salon.tags || ['Premium', 'Luxury']).map(t => (
                      <span key={t} className="text-[10px] font-medium text-[#6B6560] bg-[#F2F0EC] px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[11px]">
                    <span className="text-[#A09A91]">⏰ {salon.openingTime} – {salon.closingTime}</span>
                    <span className="text-[10px] text-[#A09A91]">{salon.reviewCount || 0} reviews</span>
                  </div>
                  <div className="mt-3 bg-[#1C1C1A] group-hover:bg-[#C9A96E] text-white text-center text-[12px] font-semibold py-2.5 rounded-xl transition-colors">
                    Book Appointment
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

