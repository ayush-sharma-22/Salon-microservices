import { useEffect, useState } from 'react';
import { salonAPI, reviewAPI } from '../services/api';

export default function AdminReviews() {
  const [salon, setSalon] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const owned = await salonAPI.getOwned();
        if (owned) {
          setSalon(owned);
          const data = await reviewAPI.getBySalon(owned.id);
          setReviews(data || []);
        }
      } catch (err) {
        console.error('Failed to load owned reviews', err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 bg-[#F7F6F3]">
        <div className="w-8 h-8 rounded-full border border-t-[#C9A96E] animate-spin mx-auto"></div>
        <p className="text-[12px] text-[#A09A91] mt-2">Loading review reports...</p>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E6E1] max-w-md mx-auto shadow-sm">
        <p className="font-display text-[1.8rem] font-light text-[#1C1C1A]">Register Salon Branch First</p>
        <p className="text-[13px] text-[#A09A91] mt-2">You need to register your branch in the Salons tab before monitoring customer reviews.</p>
      </div>
    );
  }

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '5.0';
  const dist = [5, 4, 3, 2, 1].map(n => ({
    star: n,
    count: reviews.filter(r => Math.floor(r.rating) === n).length,
  }));

  return (
    <div className="space-y-5 animate-fadein">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-sm">
          <p className="text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider">Total Reviews</p>
          <p className="font-display text-[1.9rem] font-light text-[#1C1C1A] mt-1.5">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-sm">
          <p className="text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider">Avg. Rating</p>
          <p className="font-display text-[1.9rem] font-light text-[#C9A96E] mt-1.5">{avg}★</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-sm">
          <p className="text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider">5-Star Reviews</p>
          <p className="font-display text-[1.9rem] font-light text-[#1C1C1A] mt-1.5">{reviews.filter(r => r.rating === 5).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Distribution */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm p-5">
          <h2 className="font-display text-[17px] font-light text-[#1C1C1A] mb-4">Rating Distribution</h2>
          {dist.map(d => (
            <div key={d.star} className="flex items-center gap-3 mb-2">
              <span className="text-[12px] text-[#C9A96E] w-4">{d.star}★</span>
              <div className="flex-1 bg-[#EAE8E4] rounded-full h-2">
                <div className="bg-[#C9A96E] h-2 rounded-full transition-all" style={{ width: `${reviews.length ? (d.count / reviews.length) * 100 : 0}%` }} />
              </div>
              <span className="text-[11px] text-[#A09A91] w-4">{d.count}</span>
            </div>
          ))}
        </div>

        {/* Reviews list */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F0EDE8]">
              <p className="text-[11px] text-[#A09A91]">review-service · Customer feedback channel</p>
            </div>
            <div className="divide-y divide-[#F5F3EF]">
              {reviews.length === 0 ? (
                <p className="text-center py-10 text-[13px] text-[#A09A91]">No reviews received yet for this branch.</p>
              ) : reviews.map(r => (
                <div key={r.id} className="px-6 py-5 flex gap-5 hover:bg-[#FAFAF8]">
                  <div className="flex-shrink-0 text-center">
                    <p className="font-display text-[1.8rem] font-light text-[#C9A96E] leading-none">{r.rating}</p>
                    <p className="text-[10px] text-[#C9A96E]">{'★'.repeat(Math.floor(r.rating))}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-[#1C1C1A] text-[13px]">{r.userName || `User #${r.userId}`}</p>
                      <p className="text-[10px] text-[#A09A91]">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                    <p className="text-[12px] text-[#4B4845] italic mt-1 leading-relaxed">"{r.reviewText}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


