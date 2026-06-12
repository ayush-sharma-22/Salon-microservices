import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI, salonAPI, serviceAPI, reviewAPI } from '../services/api';

const STATUS_MAP = {
  CONFIRMED:  { label: 'Confirmed',  cls: 'bg-[#EBF5F0] text-[#1A6645] border-[#b3deca]' },
  PENDING:    { label: 'Pending',    cls: 'bg-[#FBF4E6] text-[#8A5C10] border-[#e5d0a3]' },
  COMPLETED:  { label: 'Completed', cls: 'bg-[#F2F2F2] text-[#555] border-[#d8d8d8]' },
  CANCELLED:  { label: 'Cancelled', cls: 'bg-[#FDF0F0] text-[#8A1A1A] border-[#e5b3b3]' },
};

export default function MyBookings({ user }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [bookings, setBookings] = useState([]);
  const [salons, setSalons] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Review states
  const [salonReviewsMap, setSalonReviewsMap] = useState({});
  const [reviewBooking, setReviewBooking] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleOpenReviewModal = (booking, existingReview) => {
    setReviewBooking(booking);
    if (existingReview) {
      setEditingReviewId(existingReview.id);
      setReviewRating(existingReview.rating);
      setReviewText(existingReview.reviewText);
    } else {
      setEditingReviewId(null);
      setReviewRating(5);
      setReviewText('');
    }
  };

  const handleCloseReviewModal = () => {
    setReviewBooking(null);
    setEditingReviewId(null);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewBooking) return;
    setSubmittingReview(true);
    try {
      if (editingReviewId) {
        await reviewAPI.update(editingReviewId, {
          rating: reviewRating,
          reviewText: reviewText,
        });
        alert('Review updated successfully!');
      } else {
        await reviewAPI.create(reviewBooking.salonId, {
          rating: reviewRating,
          reviewText: reviewText,
        });
        alert('Thank you for your review!');
      }
      handleCloseReviewModal();
      fetchBookings();
    } catch (err) {
      console.error('Failed to submit review', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewAPI.delete(reviewId);
      alert('Review deleted.');
      fetchBookings();
    } catch (err) {
      console.error('Failed to delete review', err);
      alert('Failed to delete review. Please try again.');
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await bookingAPI.getCustomerBookings();
      setBookings(data || []);

      // Fetch all salons to map names
      const salonsData = await salonAPI.getAll();
      setSalons(salonsData || []);

      // Extract all unique service IDs from bookings
      const uniqueServiceIds = new Set();
      (data || []).forEach(b => {
        if (b.serviceIds) {
          b.serviceIds.forEach(id => uniqueServiceIds.add(id));
        }
      });

      if (uniqueServiceIds.size > 0) {
        const servicesData = await serviceAPI.getByIds(uniqueServiceIds);
        const sMap = {};
        (servicesData || []).forEach(s => {
          sMap[s.id] = s.name;
        });
        setServicesMap(sMap);
      }

      // Fetch reviews for completed bookings' salons to match if user has already reviewed them
      const completedSalons = Array.from(new Set(
        (data || []).filter(b => b.status === 'COMPLETED').map(b => b.salonId)
      ));
      const rMap = {};
      if (completedSalons.length > 0 && user) {
        try {
          const reviewPromises = completedSalons.map(salonId => 
            reviewAPI.getBySalon(salonId).catch(() => [])
          );
          const reviewsList = await Promise.all(reviewPromises);
          completedSalons.forEach((salonId, index) => {
            const salonReviews = reviewsList[index] || [];
            const userReview = salonReviews.find(r => r.userId === user.id);
            if (userReview) {
              rMap[salonId] = userReview;
            }
          });
        } catch (err) {
          console.error("Failed to load salon reviews for customer mappings", err);
        }
      }
      setSalonReviewsMap(rMap);
    } catch (err) {
      console.error('Failed to fetch user bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.updateStatus(id, 'CANCELLED');
      fetchBookings();
    } catch (err) {
      console.error('Failed to cancel booking', err);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-[2rem] font-light text-[#1C1C1A]">Sign in to view bookings</p>
        <button onClick={() => navigate('/login')} className="mt-4 text-[#C9A96E] hover:underline text-[13px]">Sign In →</button>
      </div>
    </div>
  );

  const filters = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="bg-[#F7F6F3] min-h-screen">
      <div className="bg-white border-b border-[#E8E6E1]">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-6">
          <h1 className="font-display text-[28px] font-light text-[#1C1C1A]">My Bookings</h1>
          <p className="text-[12px] text-[#A09A91] mt-1">All appointments for {user.fullName || user.username || 'Guest'}</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-8">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${filter === f ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]' : 'bg-white text-[#6B6560] border-[#E8E6E1] hover:border-[#C9A96E]'}`}>
              {f === 'ALL' ? `All (${bookings.length})` : `${f[0] + f.slice(1).toLowerCase()} (${bookings.filter(b => b.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Booking cards */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 rounded-full border border-t-[#C9A96E] animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-[1.8rem] font-light text-[#1C1C1A]">No bookings found</p>
                <button onClick={() => navigate('/salons')} className="mt-4 text-[#C9A96E] hover:underline text-[13px]">Book Now →</button>
              </div>
            ) : filtered.map(b => {
              const s = STATUS_MAP[b.status] || { label: b.status, cls: 'bg-gray-100 text-gray-800' };
              const dt = new Date(b.startTime);
              const salonName = salons.find(sl => sl.id === b.salonId)?.name || `Salon Branch #${b.salonId}`;
              const servicesString = (b.serviceIds || []).map(id => servicesMap[id] || `Service #${id}`).join(', ');

              return (
                <div key={b.id} className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden animate-fadein">
                  <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-semibold text-[#1C1C1A] text-[15px]">{servicesString || 'Grooming Session'}</p>
                        <span className={`inline-block border text-[11px] font-medium px-2.5 py-[3px] rounded-full ${s.cls}`}>{s.label}</span>
                      </div>
                      <p className="text-[12px] text-[#A09A91] mt-1">{salonName}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-[12px] text-[#6B6560]">
                        <span>📅 {dt.toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
                        <span>⏰ {dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="font-semibold text-[#1C1C1A]">₹{b.totalPrice.toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] text-[#A09A91] mt-1 font-mono">Booking ID: {b.id}</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {(b.status === 'CONFIRMED' || b.status === 'PENDING') && (
                        <button onClick={() => handleCancel(b.id)}
                          className="text-[12px] font-semibold text-red-500 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors">
                          Cancel
                        </button>
                      )}
                      {b.status === 'COMPLETED' && (
                        <div className="flex flex-col items-end gap-2">
                          {salonReviewsMap[b.salonId] ? (
                            <div className="flex flex-col items-end gap-1.5">
                              <span className="text-[11px] text-[#A09A91] font-semibold">
                                Rated: {'★'.repeat(Math.round(salonReviewsMap[b.salonId].rating))}{'☆'.repeat(5 - Math.round(salonReviewsMap[b.salonId].rating))}
                              </span>
                              <div className="flex gap-2">
                                <button onClick={() => handleOpenReviewModal(b, salonReviewsMap[b.salonId])}
                                  className="text-[12px] font-semibold text-[#C9A96E] border border-[#C9A96E]/30 hover:bg-[#C9A96E]/10 px-4 py-2 rounded-xl transition-all">
                                  Edit Review
                                </button>
                                <button onClick={() => handleDeleteReview(salonReviewsMap[b.salonId].id)}
                                  className="text-[12px] font-semibold text-red-500 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors">
                                  Delete
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => handleOpenReviewModal(b, null)}
                              className="text-[12px] font-semibold text-[#1C1C1A] border border-[#E8E6E1] hover:border-[#C9A96E] hover:bg-[#FAFAF8] px-4 py-2 rounded-xl transition-all">
                              Give Review
                            </button>
                          )}
                          <button onClick={() => navigate(`/salons/${b.salonId}`)}
                            className="text-[12px] font-semibold text-[#C9A96E] border border-[#C9A96E]/30 hover:bg-[#C9A96E] hover:text-white px-4 py-2 rounded-xl transition-all">
                            Book Again
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-2xl max-w-md w-full p-6 animate-fadein">
            <h2 className="font-display text-[20px] font-light text-[#1C1C1A] mb-1">Give Feedback</h2>
            <p className="text-[12px] text-[#A09A91] mb-6">Share your experience with the salon branch.</p>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star, i) => {
                    const val = i + 1;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setReviewRating(val)}
                        className="text-2xl transition-transform hover:scale-110"
                      >
                        {val <= reviewRating ? '★' : '☆'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Review Comment</label>
                <textarea
                  required
                  rows="4"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Describe your styling experience, staff professionalism, cleanliness, etc."
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-3 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E] placeholder-[#A09A91]"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseReviewModal}
                  className="text-[12px] font-semibold text-[#6B6560] hover:text-[#1C1C1A] px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-[#1C1C1A] hover:bg-[#C9A96E] text-white text-[12px] font-semibold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

