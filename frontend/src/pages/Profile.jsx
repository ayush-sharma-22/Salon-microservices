import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationAPI, salonAPI } from '../services/api';

export default function Profile({ user }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [salon, setSalon] = useState(null);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    if (!user) return;
    
    async function loadProfileData() {
      setLoadingNotes(true);
      try {
        let allNotes = [];
        
        // Fetch user personal notifications
        const userNotes = await notificationAPI.getByUser(user.id);
        if (userNotes) {
          allNotes = [...userNotes];
        }

        // If owner, fetch owned salon info and salon notifications
        if (user.role === 'OWNER') {
          const ownedSalon = await salonAPI.getOwned();
          if (ownedSalon) {
            setSalon(ownedSalon);
            const salonNotes = await notificationAPI.getBySalon(ownedSalon.id);
            if (salonNotes) {
              // Merge and avoid duplicate IDs if any
              const existingIds = new Set(allNotes.map(n => n.id));
              salonNotes.forEach(n => {
                if (!existingIds.has(n.id)) {
                  allNotes.push(n);
                }
              });
            }
          }
        }

        // Sort notifications by ID descending
        allNotes.sort((a, b) => b.id - a.id);
        setNotifications(allNotes);
      } catch (err) {
        console.error('Failed to load profile data', err);
      } finally {
        setLoadingNotes(false);
      }
    }

    loadProfileData();
  }, [user]);

  const handleMarkAsRead = async (noteId) => {
    setActionLoading(prev => ({ ...prev, [noteId]: true }));
    try {
      await notificationAPI.markAsRead(noteId);
      // Update local state
      setNotifications(prev =>
        prev.map(n => (n.id === noteId ? { ...n, read: true, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read', err);
      alert('Failed to update notification. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [noteId]: false }));
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead && !n.read);
    if (unread.length === 0) return;
    
    const promises = unread.map(n => notificationAPI.markAsRead(n.id));
    try {
      await Promise.all(promises);
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, isRead: true }))
      );
    } catch (err) {
      console.error('Failed to mark all as read', err);
      alert('Failed to mark some notifications as read.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-[2rem] font-light text-[#1C1C1A]">Sign in to view your profile</p>
          <button onClick={() => navigate('/login')} className="mt-4 text-[#C9A96E] hover:underline text-[13px]">Sign In →</button>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead && !n.read).length;

  return (
    <div className="bg-[#F7F6F3] min-h-screen pb-12">
      <div className="bg-white border-b border-[#E8E6E1]">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-6">
          <h1 className="font-display text-[28px] font-light text-[#1C1C1A]">My Profile</h1>
          <p className="text-[12px] text-[#A09A91] mt-1">Manage details and view your notifications</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Details Card */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm p-6 space-y-6 self-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/20 border border-[#C9A96E]/40 flex items-center justify-center text-[#C9A96E] text-[24px] font-bold">
              {(user.fullName || user.username || 'U')[0]}
            </div>
            <div>
              <h2 className="font-semibold text-[#1C1C1A] text-[18px]">{user.fullName || 'User Profile'}</h2>
              <span className="inline-block bg-[#1C1C1A] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full mt-1">
                {user.role}
              </span>
            </div>
          </div>

          <hr className="border-[#F0EDE8]" />

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider">Username / Email</p>
              <p className="text-[14px] text-[#1C1C1A] font-medium mt-0.5">{user.username || user.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider">Contact Number</p>
              <p className="text-[14px] text-[#1C1C1A] font-medium mt-0.5">{user.phone || 'Not Provided'}</p>
            </div>
            {salon && (
              <div>
                <p className="text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider">Associated Salon Branch</p>
                <p className="text-[14px] text-[#C9A96E] font-medium mt-0.5">{salon.name}</p>
                <p className="text-[11px] text-[#A09A91]">{salon.city}, {salon.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-[#F0EDE8] flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-display text-[18px] font-light text-[#1C1C1A]">Booking Notifications</h2>
                <p className="text-[11px] text-[#A09A91] mt-0.5">Real-time status updates on appointments</p>
              </div>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllAsRead} className="text-[12px] font-semibold text-[#C9A96E] hover:underline">
                  Mark all as read
                </button>
              )}
            </div>

            {loadingNotes ? (
              <div className="text-center py-20">
                <div className="w-8 h-8 rounded-full border border-t-[#C9A96E] animate-spin mx-auto"></div>
                <p className="text-[12px] text-[#A09A91] mt-2">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-[1.5rem] font-light text-[#1C1C1A]">No notifications yet</p>
                <p className="text-[12px] text-[#A09A91] mt-1">Updates on your bookings will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F5F3EF]">
                {notifications.map(n => {
                  const isUnread = !n.isRead && !n.read;
                  const date = n.createdAt ? new Date(n.createdAt) : new Date();
                  return (
                    <div key={n.id} className={`p-6 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${isUnread ? 'bg-[#FCFBF9]' : ''}`}>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            n.type === 'BOOKING_CREATED' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            n.type === 'BOOKING_CANCELLED' ? 'bg-red-50 text-red-600 border border-red-100' :
                            n.type === 'BOOKING_CONFIRMED' ? 'bg-green-50 text-green-600 border border-green-100' :
                            'bg-gray-50 text-gray-600 border border-gray-100'
                          }`}>
                            {n.type?.replace('_', ' ') || 'UPDATE'}
                          </span>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-[#C9A96E]"></span>
                          )}
                        </div>
                        <p className="text-[13px] text-[#1C1C1A] font-medium leading-relaxed">{n.description}</p>
                        <div className="flex items-center gap-4 text-[11px] text-[#A09A91] flex-wrap">
                          <span>📅 {date.toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                          <span>⏰ {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                          {n.bookingId && (
                            <span className="font-mono text-[10px]">Ref: #{n.bookingId}</span>
                          )}
                        </div>
                      </div>

                      {isUnread && (
                        <button
                          disabled={actionLoading[n.id]}
                          onClick={() => handleMarkAsRead(n.id)}
                          className="self-start sm:self-center text-[12px] font-semibold text-[#1C1C1A] border border-[#E8E6E1] hover:border-[#C9A96E] hover:bg-[#FAFAF8] px-3.5 py-1.5 rounded-xl transition-all disabled:opacity-50"
                        >
                          {actionLoading[n.id] ? '...' : 'Mark read'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
