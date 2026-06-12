import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { salonAPI, bookingAPI, serviceAPI } from '../services/api';

function KpiCard({ label, val, sub, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-sm">
      <p className="text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider">{label}</p>
      <p className={`font-display text-[1.9rem] font-light mt-1.5 leading-none ${accent || 'text-[#1C1C1A]'}`}>{val}</p>
      {sub && <p className="text-[11px] text-[#A09A91] mt-2 font-medium">{sub}</p>}
    </div>
  );
}

const STATUS_MAP = {
  CONFIRMED: 'bg-[#EBF5F0] text-[#1A6645] border-[#b3deca]',
  PENDING:   'bg-[#FBF4E6] text-[#8A5C10] border-[#e5d0a3]',
  COMPLETED: 'bg-[#F2F2F2] text-[#555] border-[#d8d8d8]',
  CANCELLED: 'bg-[#FDF0F0] text-[#8A1A1A] border-[#e5b3b3]',
};

export default function AdminOverview() {
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [report, setReport] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const ownedSalon = await salonAPI.getOwned();
        if (ownedSalon) {
          setSalon(ownedSalon);
          const [reportData, bookingsData, servicesData] = await Promise.all([
            bookingAPI.getReport(),
            bookingAPI.getSalonBookings(),
            serviceAPI.getBySalon(ownedSalon.id)
          ]);
          setReport(reportData);
          setBookings(bookingsData || []);
          setServices(servicesData || []);
        }
      } catch (err) {
        console.error('Failed to load owner overview', err);
      } finally {
        setLoading(false);
      }
    }
    loadOverview();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 bg-[#F7F6F3]">
        <div className="w-8 h-8 rounded-full border border-t-[#C9A96E] animate-spin mx-auto"></div>
        <p className="text-[12px] text-[#A09A91] mt-2">Loading overview statistics...</p>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="bg-white rounded-2xl border border-[#E8E6E1] p-10 text-center max-w-md mx-auto shadow-sm">
        <p className="font-display text-[1.8rem] font-light text-[#1C1C1A]">Register Your Salon</p>
        <p className="text-[13px] text-[#A09A91] mt-2 mb-6">You need to register your salon branch before accessing statistics.</p>
        <button onClick={() => navigate('/admin/salons')}
          className="bg-[#1C1C1A] text-white px-6 py-3 rounded-xl font-semibold text-[13px] hover:bg-[#C9A96E] transition-colors">
          Go to Registration
        </button>
      </div>
    );
  }

  const earnings = report?.totalEarnings || 0;
  const totalBookings = report?.totalBookings || 0;
  const canceledBookings = report?.cancelBookings || 0;
  const activeBookingsCount = bookings.filter(b => b.status === 'PENDING').length;

  return (
    <div className="space-y-6 animate-fadein">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Bookings" val={totalBookings} sub={`${activeBookingsCount} pending`} />
        <KpiCard label="Revenue (₹)" val={`₹${earnings.toLocaleString()}`} sub="Completed appointments" accent="text-emerald-600" />
        <KpiCard label="Cancelled Appointments" val={canceledBookings} sub="Refund requests initiated" accent="text-red-500" />
        <KpiCard label="Branch Name" val={salon.name} sub={`${salon.city}`} accent="text-[#C9A96E]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F0EDE8] flex justify-between items-center">
            <div>
              <h2 className="font-display text-[17px] font-light text-[#1C1C1A]">Recent Appointments</h2>
              <p className="text-[10px] text-[#A09A91] mt-0.5">booking-service · Appointment logs</p>
            </div>
            <button onClick={() => navigate('/admin/bookings')} className="text-[11px] font-semibold text-[#C9A96E] hover:underline">All →</button>
          </div>
          {bookings.length === 0 ? (
            <p className="text-[13px] text-[#A09A91] py-8 text-center">No bookings received yet.</p>
          ) : (
            <div className="divide-y divide-[#F5F3EF]">
              {bookings.slice(0, 5).map(b => {
                const dt = new Date(b.startTime);
                return (
                  <div key={b.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-[#FAFAF8]">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#1C1C1A] truncate">{`Booking Ref #${b.id}`}</p>
                      <p className="text-[11px] text-[#A09A91]">{dt.toLocaleDateString('en-IN')} at {dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <span className="text-[13px] font-semibold text-[#1C1C1A]">₹{b.totalPrice.toLocaleString()}</span>
                    <span className={`inline-block border text-[10px] font-medium px-2 py-[2px] rounded-full ${STATUS_MAP[b.status] || 'bg-gray-100'}`}>{b.status}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Salon details */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F0EDE8]">
            <h2 className="font-display text-[17px] font-light text-[#1C1C1A]">My Branch Info</h2>
            <p className="text-[10px] text-[#A09A91] mt-0.5">salon-service configuration</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider">Address</p>
              <p className="text-[13px] text-[#1C1C1A] mt-0.5">{salon.address}, {salon.city}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider">Timings</p>
              <p className="text-[13px] text-[#1C1C1A] mt-0.5">⏰ {salon.openingTime} – {salon.closingTime}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider">Contacts</p>
              <p className="text-[13px] text-[#1C1C1A] mt-0.5">📞 {salon.phoneNumber}</p>
              <p className="text-[13px] text-[#1C1C1A] mt-0.5">✉️ {salon.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service popularity */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE8]">
          <h2 className="font-display text-[17px] font-light text-[#1C1C1A]">Service Catalog</h2>
          <p className="text-[10px] text-[#A09A91] mt-0.5">service-offering entity · {services.length} offerings configured</p>
        </div>
        {services.length === 0 ? (
          <p className="text-[13px] text-[#A09A91] py-8 text-center">No services cataloged yet. Please add them in the Services page.</p>
        ) : (
          <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.slice(0, 6).map(s => (
              <div key={s.id} className="flex items-center justify-between border border-[#F0EDE8] rounded-xl px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#1C1C1A] truncate">{s.name}</p>
                  <p className="text-[10px] text-[#A09A91]">{s.duration} min</p>
                </div>
                <p className="text-[13px] font-semibold text-[#1C1C1A] flex-shrink-0 ml-2">₹{s.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


