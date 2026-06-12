import { useState, useEffect } from 'react';
import { salonAPI } from '../services/api';

export default function AdminSalons() {
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', city: '', phoneNumber: '', email: '', openingTime: '09:00', closingTime: '21:00' });

  const loadSalon = async () => {
    try {
      const owned = await salonAPI.getOwned();
      if (owned) {
        setSalon(owned);
        setForm(owned);
      }
    } catch (err) {
      console.error('Failed to get owned salon', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalon();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (salon) {
        // Update salon
        const updated = await salonAPI.update(salon.id, form);
        setSalon(updated);
        setEditing(false);
      } else {
        // Register new salon
        const created = await salonAPI.create(form);
        setSalon(created);
      }
    } catch (err) {
      console.error('Failed to save salon details', err);
      alert('Failed to save branch. Please check timing format (e.g. 09:00:00).');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 bg-[#F7F6F3]">
        <div className="w-8 h-8 rounded-full border border-t-[#C9A96E] animate-spin mx-auto"></div>
        <p className="text-[12px] text-[#A09A91] mt-2">Loading branch configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 animate-fadein">
      {!salon || editing ? (
        <div className="bg-white rounded-2xl border border-[#E8E6E1] p-7 shadow-sm">
          <h2 className="font-display text-[20px] font-light text-[#1C1C1A] mb-5">
            {salon ? 'Edit Branch Details' : 'Register Your Salon Branch'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Salon Name</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Aura Luxury Salon"
                className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">City</label>
                <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. New Delhi"
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Phone Number</label>
                <input required value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                  placeholder="+91-11-4567-8900"
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Email</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="branch@aurasalon.com"
                className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Full Address</label>
              <input required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="12 MG Road, Connaught Place"
                className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Opening Time</label>
                <input required value={form.openingTime} onChange={e => setForm({ ...form, openingTime: e.target.value })}
                  placeholder="09:00:00"
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Closing Time</label>
                <input required value={form.closingTime} onChange={e => setForm({ ...form, closingTime: e.target.value })}
                  placeholder="20:00:00"
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              {salon && (
                <button type="button" onClick={() => setEditing(false)}
                  className="flex-1 border border-[#E8E6E1] text-[#6B6560] py-3 rounded-xl font-semibold text-[13px]">
                  Cancel
                </button>
              )}
              <button type="submit"
                className="flex-1 bg-[#1C1C1A] hover:bg-[#C9A96E] text-white py-3 rounded-xl font-semibold text-[13px] transition-colors">
                Save Branch Info
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden">
          <div className="h-36 bg-gradient-to-br from-[#E8DFD0] to-[#D4C5B0] flex items-center justify-center">
            <span className="font-display text-5xl text-[#6B5740] font-light opacity-30">{salon.name[0]}</span>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-[#1C1C1A] text-lg">{salon.name}</h3>
                <p className="text-[12px] text-[#A09A91] mt-0.5">{salon.city}</p>
              </div>
              <button onClick={() => setEditing(true)}
                className="text-[12px] font-semibold text-[#C9A96E] hover:underline">
                Edit Details
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#F0EDE8] text-[12px] text-[#6B6560]">
              <div>
                <span className="text-[#A09A91] block text-[10px] font-semibold uppercase tracking-wider mb-0.5">Address</span>
                <p>{salon.address}</p>
              </div>
              <div>
                <span className="text-[#A09A91] block text-[10px] font-semibold uppercase tracking-wider mb-0.5">Phone Number</span>
                <p>{salon.phoneNumber}</p>
              </div>
              <div>
                <span className="text-[#A09A91] block text-[10px] font-semibold uppercase tracking-wider mb-0.5">Operating Hours</span>
                <p>{salon.openingTime} – {salon.closingTime}</p>
              </div>
              <div>
                <span className="text-[#A09A91] block text-[10px] font-semibold uppercase tracking-wider mb-0.5">Email</span>
                <p>{salon.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


