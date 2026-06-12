import { useState, useEffect } from 'react';
import { bookingAPI, serviceAPI } from '../services/api';

const STATUS_MAP = {
  CONFIRMED: { label: 'Confirmed', cls: 'bg-[#EBF5F0] text-[#1A6645] border-[#b3deca]' },
  PENDING:   { label: 'Pending',   cls: 'bg-[#FBF4E6] text-[#8A5C10] border-[#e5d0a3]' },
  COMPLETED: { label: 'Completed', cls: 'bg-[#F2F2F2] text-[#555] border-[#d8d8d8]' },
  CANCELLED: { label: 'Cancelled', cls: 'bg-[#FDF0F0] text-[#8A1A1A] border-[#e5b3b3]' },
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const data = await bookingAPI.getSalonBookings();
      setBookings(data || []);

      // Extract unique service IDs to fetch details
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
    } catch (err) {
      console.error('Failed to load salon bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, status);
      fetchBookings();
    } catch (err) {
      console.error('Failed to update booking status', err);
      alert('Failed to update appointment. Please try again.');
    }
  };

  const advance = (id, currentStatus) => {
    const nextStatus = currentStatus === 'PENDING' ? 'CONFIRMED' : 'COMPLETED';
    handleUpdateStatus(id, nextStatus);
  };

  const cancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      handleUpdateStatus(id, 'CANCELLED');
    }
  };

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="space-y-5 animate-fadein">
      <div className="flex flex-wrap gap-2">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${filter === f ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]' : 'bg-white text-[#6B6560] border-[#E8E6E1] hover:border-[#C9A96E]'}`}>
            {f === 'ALL' ? `All (${bookings.length})` : `${f[0]+f.slice(1).toLowerCase()} (${bookings.filter(b=>b.status===f).length})`}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE8]">
          <p className="text-[11px] text-[#A09A91]">booking-service · Appointment management dashboard</p>
        </div>
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 rounded-full border border-t-[#C9A96E] animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F0EDE8] bg-[#FAFAF8]">
                  {['ID', 'Services', 'Date & Time', 'Price', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F3EF]">
                {filtered.map(b => {
                  const s = STATUS_MAP[b.status] || { label: b.status, cls: 'bg-gray-100 text-gray-800' };
                  const dt = new Date(b.startTime);
                  const servicesString = (b.serviceIds || []).map(id => servicesMap[id] || `Service #${id}`).join(', ');

                  return (
                    <tr key={b.id} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="px-5 py-4 font-mono text-[10px] text-[#A09A91]">{b.id}</td>
                      <td className="px-5 py-4">
                        <p className="text-[13px] font-semibold text-[#1C1C1A]">{servicesString || 'Grooming Session'}</p>
                        <p className="text-[10px] text-[#A09A91]">CustomerId: {b.customerId}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[12px] text-[#4B4845]">{dt.toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                        <p className="text-[11px] text-[#A09A91] font-mono">{dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#1C1C1A]">₹{b.totalPrice.toLocaleString()}</td>
                      <td className="px-5 py-4"><span className={`inline-block border text-[10px] font-medium px-2.5 py-[3px] rounded-full ${s.cls}`}>{s.label}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && (
                            <button onClick={() => advance(b.id, b.status)} className="text-[11px] font-semibold text-[#C9A96E] hover:underline">
                              {b.status === 'PENDING' ? 'Approve' : 'Complete'}
                            </button>
                          )}
                          {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                            <button onClick={() => cancel(b.id)} className="text-[11px] font-semibold text-red-400 hover:underline">Cancel</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


