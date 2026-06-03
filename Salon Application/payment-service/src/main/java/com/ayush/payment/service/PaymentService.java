package com.ayush.payment.service;

import com.ayush.payment.enums.PaymentMethod;
import com.ayush.payment.payload.dto.BookingDTO;
import com.ayush.payment.payload.dto.UserDTO;
import com.ayush.payment.model.PaymentOrder;
import com.ayush.payment.payload.response.PaymentLinkResponse;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;

public interface PaymentService {
    PaymentLinkResponse createOrder(UserDTO userDTO, BookingDTO bookingDTO, PaymentMethod paymentMethod) throws RazorpayException, StripeException;

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    PaymentOrder getPaymentOrderByPaymentLinkId(String paymentLinkId);

    PaymentLink createRazorpayPaymentLink(UserDTO userDTO, Long amount, Long orderId) throws RazorpayException;

    String createStripePaymentLink(UserDTO userDTO, Long amount, Long orderId) throws StripeException;

    Boolean proceedPayment(PaymentOrder paymentOrder, String paymentId, String paymentLinkId) throws RazorpayException;
}
