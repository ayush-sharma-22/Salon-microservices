import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { salonAPI, serviceAPI, bookingAPI } from '../services/api';

const STEPS = ['Select Services', 'Pick a Slot', 'Confirm'];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00',
];

export default function Booking({ user }) {
  const { salonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselect = searchParams.get('service');

  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState(preselect ? [Number(preselect)] : []);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState('STRIPE');
  const [bookingResponse, setBookingResponse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    async function loadInitialData() {
      if (!salonId) return;
      try {
        const [salonData, servicesData] = await Promise.all([
          salonAPI.getById(salonId),
          serviceAPI.getBySalon(salonId),
        ]);
        setSalon(salonData);
        setServices(servicesData || []);
      } catch (err) {
        console.error('Failed to load booking dependencies', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [salonId]);

  useEffect(() => {
    if (preselect && services.length > 0) {
      setSelectedServices([Number(preselect)]);
    }
  }, [preselect, services]);

  // Load booked slots dynamically when date changes
  useEffect(() => {
    async function loadBookedSlots() {
      if (!salonId || !selectedDate) return;
      try {
        const slots = await bookingAPI.getBookedSlots(salonId, selectedDate);
        // Map slot start times to string format
        const bookedStarts = (slots || []).map(s => {
          if (s.startTime) {
            // "2026-06-12T10:00:00" -> "10:00"
            const timePart = s.startTime.split('T')[1];
            return timePart ? timePart.substring(0, 5) : '';
          }
          return '';
        }).filter(Boolean);
        setBookedSlots(bookedStarts);
      } catch (err) {
        console.error('Failed to fetch booked slots', err);
      }
    }
    loadBookedSlots();
  }, [salonId, selectedDate]);

  if (!user) return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#E8E6E1] p-8 text-center max-w-sm w-full shadow-sm">
        <p className="font-display text-[1.6rem] font-light text-[#1C1C1A]">Sign in to book</p>
        <p className="text-[13px] text-[#A09A91] mt-2">You need an account to book appointments.</p>
        <button onClick={() => navigate('/login')} className="mt-5 w-full bg-[#1C1C1A] text-white py-3 rounded-xl font-semibold text-[13px] hover:bg-[#C9A96E] transition-colors">Sign In</button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 rounded-full border border-t-[#C9A96E] animate-spin mx-auto"></div>
        <p className="text-[12px] text-[#A09A91] mt-2">Loading booking menu...</p>
      </div>
    </div>
  );

  if (!salon) return <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center"><p className="text-[#A09A91]">Salon not found.</p></div>;

  const totalPrice = selectedServices.reduce((sum, id) => {
    const svc = services.find(s => s.id === id);
    return sum + (svc?.price || 0);
  }, 0);
  const totalDuration = selectedServices.reduce((sum, id) => {
    const svc = services.find(s => s.id === id);
    return sum + (svc?.duration || 0);
  }, 0);

  const toggleService = (id) => {
    setSelectedServices(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      // Calculate start and end times
      const startTime = `${selectedDate}T${selectedSlot}:00`;
      
      // Calculate end time based on total duration of selected services
      const slotHour = parseInt(selectedSlot.split(':')[0]);
      const slotMin = parseInt(selectedSlot.split(':')[1]);
      const totalMinutes = slotHour * 60 + slotMin + totalDuration;
      const endHour = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
      const endMin = (totalMinutes % 60).toString().padStart(2, '0');
      const endTime = `${selectedDate}T${endHour}:${endMin}:00`;

      const payload = {
        startTime,
        endTime,
        serviceIds: selectedServices,
        totalPrice,
        salonId: Number(salonId),
      };

      const res = await bookingAPI.create(Number(salonId), paymentMethod, payload);
      setBookingResponse(res);
      setStep(3); // Go to completed / redirect step
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit booking. Slot might be unavailable.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 3) return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#E8E6E1] p-10 text-center max-w-md w-full shadow-sm">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-600">
          <span className="text-3xl font-bold">✓</span>
        </div>
        <p className="font-display text-[2rem] font-light text-[#1C1C1A]">Booking Initiated!</p>
        <p className="text-[13px] text-[#A09A91] mt-2">
          Your appointment at <strong className="text-[#1C1C1A]">{salon.name}</strong> has been saved. Please complete the payment.
        </p>

        {bookingResponse?.paymentLinkUrl && (
          <a href={bookingResponse.paymentLinkUrl} target="_blank" rel="noopener noreferrer"
            className="mt-6 block w-full bg-[#C9A96E] hover:bg-[#b8945a] text-white py-3 rounded-xl font-semibold text-[13px] transition-colors shadow-md">
            Proceed to Payment ({paymentMethod})
          </a>
        )}

        <div className="mt-5 bg-[#FAFAF8] border border-[#F0EDE8] rounded-xl p-4 text-left">
          <div className="flex justify-between text-[13px]">
            <span className="text-[#A09A91]">Total Price</span>
            <span className="font-semibold text-[#1C1C1A]">₹{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[13px] mt-1">
            <span className="text-[#A09A91]">Status</span>
            <span className="font-semibold text-amber-600">PENDING</span>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => navigate('/my-bookings')} className="flex-1 bg-[#1C1C1A] text-white py-3 rounded-xl font-semibold text-[13px] hover:bg-[#C9A96E] transition-colors">My Bookings</button>
          <button onClick={() => navigate('/')} className="flex-1 border border-[#E8E6E1] text-[#6B6560] py-3 rounded-xl font-semibold text-[13px] hover:border-[#C9A96E] transition-colors">Home</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F7F6F3] min-h-screen">
      {/* Sub-header */}
      <div className="bg-white border-b border-[#E8E6E1]">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-5">
          <button onClick={() => navigate(`/salons/${salonId}`)} className="text-[11px] text-[#A09A91] hover:text-[#C9A96E] mb-2 block">← Back to {salon.name}</button>
          <h1 className="font-display text-[24px] font-light text-[#1C1C1A]">Book Appointment</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`flex items-center gap-2 ${i <= step ? 'text-[#1C1C1A]' : 'text-[#A09A91]'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors ${i < step ? 'bg-[#C9A96E] text-white' : i === step ? 'bg-[#1C1C1A] text-white' : 'bg-[#E8E6E1] text-[#A09A91]'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-[12px] font-medium hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-3 ${i < step ? 'bg-[#C9A96E]' : 'bg-[#E8E6E1]'}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Select Services */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-[20px] font-light text-[#1C1C1A]">Choose your services</h2>
            {services.length === 0 ? (
              <p className="text-center py-10 bg-white rounded-2xl border border-[#E8E6E1] text-[13px] text-[#A09A91]">No services cataloged at this branch.</p>
            ) : services.map(svc => {
              const sel = selectedServices.includes(svc.id);
              return (
                <button key={svc.id} onClick={() => toggleService(svc.id)}
                  className={`w-full text-left bg-white rounded-2xl border p-5 transition-all ${sel ? 'border-[#C9A96E] shadow-md' : 'border-[#E8E6E1] hover:border-[#C9A96E]/50'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${sel ? 'bg-[#C9A96E] border-[#C9A96E]' : 'border-[#E8E6E1]'}`}>
                        {sel && <span className="text-white text-[10px] font-bold">✓</span>}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1C1C1A]">{svc.name}</p>
                        <p className="text-[11px] text-[#A09A91] mt-0.5 leading-relaxed">{svc.description}</p>
                        <p className="text-[11px] text-[#6B6560] mt-1">⏱ {svc.duration} min</p>
                      </div>
                    </div>
                    <p className="font-display text-[1.3rem] font-light text-[#1C1C1A] flex-shrink-0">₹{svc.price.toLocaleString()}</p>
                  </div>
                </button>
              );
            })}

            {selectedServices.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E8E6E1] p-4 flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-[#A09A91]">{selectedServices.length} service(s) · {totalDuration} min</p>
                  <p className="font-display text-[1.4rem] font-light text-[#1C1C1A]">₹{totalPrice.toLocaleString()}</p>
                </div>
                <button onClick={() => setStep(1)} className="bg-[#1C1C1A] hover:bg-[#C9A96E] text-white font-semibold px-6 py-2.5 rounded-xl text-[13px] transition-colors">
                  Continue →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Pick slot */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-display text-[20px] font-light text-[#1C1C1A]">Select date & time</h2>
            <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-sm">
              <p className="text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-2">Date</p>
              <input type="date" value={selectedDate} min={new Date().toISOString().slice(0, 10)}
                onChange={e => setSelectedDate(e.target.value)}
                className="bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
            </div>
            <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-sm">
              <p className="text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-3">Available Slots</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {TIME_SLOTS.map(slot => {
                  const booked = bookedSlots.includes(slot);
                  const selected = selectedSlot === slot;
                  return (
                    <button key={slot} disabled={booked} onClick={() => setSelectedSlot(slot)}
                      className={`py-2 rounded-xl text-[12px] font-medium border transition-all ${booked ? 'bg-[#F5F3EF] text-[#C4BFB8] border-[#EAE8E4] cursor-not-allowed line-through' : selected ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]' : 'bg-white border-[#E8E6E1] text-[#1C1C1A] hover:border-[#C9A96E]'}`}>
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 border border-[#E8E6E1] text-[#6B6560] py-3 rounded-xl font-semibold text-[13px] hover:border-[#C9A96E] transition-colors">← Back</button>
              <button disabled={!selectedSlot} onClick={() => setStep(2)}
                className="flex-1 bg-[#1C1C1A] hover:bg-[#C9A96E] disabled:bg-[#E8E6E1] disabled:text-[#A09A91] text-white font-semibold py-3 rounded-xl text-[13px] transition-colors">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-display text-[20px] font-light text-[#1C1C1A]">Confirm your booking</h2>
            <div className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-sm space-y-4">
              <div className="pb-4 border-b border-[#F0EDE8]">
                <p className="text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1">Salon</p>
                <p className="font-semibold text-[#1C1C1A]">{salon.name}</p>
                <p className="text-[12px] text-[#A09A91]">{salon.address}</p>
              </div>
              <div className="pb-4 border-b border-[#F0EDE8]">
                <p className="text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-2">Services</p>
                {selectedServices.map(id => {
                  const svc = services.find(s => s.id === id);
                  return svc ? (
                    <div key={id} className="flex justify-between text-[13px] mb-1">
                      <span className="text-[#4B4845]">{svc.name} ({svc.duration} min)</span>
                      <span className="font-semibold text-[#1C1C1A]">₹{svc.price.toLocaleString()}</span>
                    </div>
                  ) : null;
                })}
              </div>
              <div className="pb-4 border-b border-[#F0EDE8]">
                <p className="text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1">Date & Time</p>
                <p className="text-[13px] text-[#1C1C1A] font-medium">{selectedDate} at {selectedSlot}</p>
              </div>

              <div className="pb-4 border-b border-[#F0EDE8]">
                <p className="text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-2">Payment Method</p>
                <div className="flex gap-3">
                  {['STRIPE', 'RAZORPAY'].map(m => (
                    <button key={m} onClick={() => setPaymentMethod(m)}
                      className={`flex-1 py-2.5 rounded-xl border text-[12px] font-semibold transition-all ${paymentMethod === m ? 'border-[#C9A96E] bg-white text-[#C9A96E] shadow-sm' : 'border-[#E8E6E1] bg-[#FAFAF8] text-[#A09A91]'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1">Add a Note (optional)</p>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                  placeholder="Any special requests..."
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E] resize-none" />
              </div>
              <div className="bg-[#1C1C1A] rounded-xl p-4 flex justify-between text-white">
                <div>
                  <p className="text-[11px] text-white/50">Total · {totalDuration} min</p>
                  <p className="font-display text-[1.8rem] font-light">₹{totalPrice.toLocaleString()}</p>
                </div>
                <div className="text-right text-[11px] text-white/50">
                  <p>Status on confirm:</p>
                  <p className="font-semibold text-amber-400 text-[12px]">PENDING</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-[#E8E6E1] text-[#6B6560] py-3 rounded-xl font-semibold text-[13px] hover:border-[#C9A96E] transition-colors">← Back</button>
              <button onClick={handleConfirm} disabled={submitting}
                className="flex-1 bg-[#C9A96E] hover:bg-[#b8945a] text-white font-semibold py-3 rounded-xl text-[13px] transition-colors disabled:opacity-50">
                {submitting ? 'Creating Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

