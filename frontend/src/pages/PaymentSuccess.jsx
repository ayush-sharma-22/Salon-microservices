import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { paymentAPI } from '../services/api';

export default function PaymentSuccess() {
  const { id } = useParams(); // paymentOrderId
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentOrder, setPaymentOrder] = useState(null);

  const razorpayPaymentId = searchParams.get('razorpay_payment_id');
  const razorpayPaymentLinkId = searchParams.get('razorpay_payment_link_id');
  const razorpayStatus = searchParams.get('razorpay_payment_link_status');

  useEffect(() => {
    async function verifyAndLoad() {
      try {
        setLoading(true);
        // If razorpay query parameters are present, process/proceed the payment first
        if (razorpayPaymentId && razorpayPaymentLinkId) {
          await paymentAPI.proceed(razorpayPaymentId, razorpayPaymentLinkId);
        }
        
        // Load the updated payment order details
        const orderData = await paymentAPI.getById(Number(id));
        setPaymentOrder(orderData);
      } catch (err) {
        console.error("Error verifying payment:", err);
        setError("Failed to verify payment details. Please check your bookings page.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      verifyAndLoad();
    }
  }, [id, razorpayPaymentId, razorpayPaymentLinkId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-t-[#C9A96E] border-r-transparent border-b-transparent border-l-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-[12px] text-[#A09A91] font-medium tracking-wider">VERIFYING PAYMENT...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-red-100 p-8 text-center max-w-md w-full shadow-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 text-red-500">
            <span className="text-3xl">✕</span>
          </div>
          <h2 className="font-display text-[1.8rem] font-light text-[#1C1C1A]">Verification Failed</h2>
          <p className="text-[13px] text-[#A09A91] mt-3 leading-relaxed">{error}</p>
          <div className="mt-8 flex gap-3">
            <button onClick={() => navigate('/my-bookings')} className="flex-1 bg-[#1C1C1A] text-white py-3 rounded-xl font-semibold text-[13px] hover:bg-[#C9A96E] transition-colors">My Bookings</button>
            <button onClick={() => navigate('/')} className="flex-1 border border-[#E8E6E1] text-[#6B6560] py-3 rounded-xl font-semibold text-[13px] hover:border-[#C9A96E] transition-colors">Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#E8E6E1] p-10 text-center max-w-md w-full shadow-sm animate-fadein">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-600">
          <span className="text-3xl font-bold">✓</span>
        </div>
        <h2 className="font-display text-[2rem] font-light text-[#1C1C1A] tracking-tight">Payment Successful</h2>
        <p className="text-[13px] text-[#A09A91] mt-2">
          Your payment has been successfully processed and confirmed.
        </p>

        {paymentOrder && (
          <div className="mt-6 bg-[#FAFAF8] border border-[#F0EDE8] rounded-xl p-5 text-left space-y-2.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#A09A91]">Booking ID</span>
              <span className="font-semibold text-[#1C1C1A]">#{paymentOrder.bookingId}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#A09A91]">Payment ID</span>
              <span className="font-semibold text-[#1C1C1A]">#{paymentOrder.paymentId}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#A09A91]">Amount Paid</span>
              <span className="font-semibold text-[#1C1C1A]">₹{paymentOrder.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#A09A91]">Payment Method</span>
              <span className="font-semibold text-[#1C1C1A]">{paymentOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-[13px] pt-2 border-t border-[#F0EDE8]">
              <span className="text-[#A09A91]">Status</span>
              <span className="font-semibold text-emerald-600 tracking-wider text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full">
                {paymentOrder.status}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          <button onClick={() => navigate('/my-bookings')} className="flex-1 bg-[#1C1C1A] text-white py-3 rounded-xl font-semibold text-[13px] hover:bg-[#C9A96E] transition-colors shadow-sm">View Bookings</button>
          <button onClick={() => navigate('/')} className="flex-1 border border-[#E8E6E1] text-[#6B6560] py-3 rounded-xl font-semibold text-[13px] hover:border-[#C9A96E] transition-colors">Go Home</button>
        </div>
      </div>
    </div>
  );
}
