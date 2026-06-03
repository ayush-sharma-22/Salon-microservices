package com.ayush.payment.service;

import com.ayush.payment.enums.PaymentMethod;
import com.ayush.payment.enums.PaymentOrderStatus;
import com.ayush.payment.model.PaymentOrder;
import com.ayush.payment.payload.dto.BookingDTO;
import com.ayush.payment.payload.dto.UserDTO;
import com.ayush.payment.payload.response.PaymentLinkResponse;
import com.ayush.payment.repository.PaymentRepository;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService{

    private final PaymentRepository paymentRepository;

    @Value("${stripe.api.secret}")
    private String STRIPE_SECRET_KEY;

    @Value("${stripe.api.key}")
    private String STRIPE_API_KEY;

    @Value("${razorpay.api.secret}")
    private String RAZORPAY_SECRET_KEY;

    @Value("${razorpay.api.key}")
    private String RAZORPAY_API_KEY;



    @Override
    public PaymentLinkResponse createOrder(UserDTO userDTO,
                                           BookingDTO bookingDTO,
                                           PaymentMethod paymentMethod) throws RazorpayException, StripeException {

        Long amount =(long) bookingDTO.getTotalPrice();

        PaymentOrder order = new PaymentOrder();
        order.setUserId(userDTO.getId());
        order.setPaymentMethod(paymentMethod);
        order.setAmount(amount);
        order.setBookingId(bookingDTO.getId());
        order.setSalonId(bookingDTO.getSalonId());
        order.setPaymentMethod(paymentMethod);
        order.setStatus(PaymentOrderStatus.PENDING);

        PaymentOrder savedOrder = paymentRepository.save(order);

        PaymentLinkResponse paymentLinkResponse = new PaymentLinkResponse();

        if (paymentMethod.equals(PaymentMethod.RAZORPAY)){
            PaymentLink payment =
                    createRazorpayPaymentLink(userDTO, savedOrder.getAmount(), savedOrder.getPaymentId());

            String paymentUrl = payment.get("short_url");
            String paymentUrlId = payment.get("id");

            paymentLinkResponse.setPaymentLinkUrl(paymentUrl);
            paymentLinkResponse.setPaymentLinkId(paymentUrlId);

            savedOrder.setPaymentLinkId(paymentUrlId);

            paymentRepository.save(savedOrder);

        }else{
            String paymentUrl =
                    createStripePaymentLink(userDTO, savedOrder.getAmount(), savedOrder.getPaymentId());
            paymentLinkResponse.setPaymentLinkUrl(paymentUrl);
            paymentLinkResponse.setPaymentLinkId(savedOrder.getPaymentLinkId());
        }
        return paymentLinkResponse;
    }

    @Override
    public PaymentOrder getPaymentOrderById(Long id) throws Exception {
        PaymentOrder order = paymentRepository.findById(id).orElse(null);
        if(order == null){
            throw new Exception("Null");
        }
        return order;
    }

    @Override
    public PaymentOrder getPaymentOrderByPaymentLinkId(String paymentLinkId) {
        return paymentRepository.findByPaymentLinkId(paymentLinkId);
    }

    @Override
    public PaymentLink createRazorpayPaymentLink(UserDTO userDTO, Long amount, Long orderId) throws RazorpayException {

        Long savingAmount = amount * 100;

        RazorpayClient razorpayClient = new RazorpayClient(RAZORPAY_API_KEY, RAZORPAY_SECRET_KEY);

        JSONObject paymentLinkRequest = new JSONObject();
        paymentLinkRequest.put("amount", savingAmount);
        paymentLinkRequest.put("currency", "INR");

        JSONObject customer = new JSONObject();
        customer.put("name", userDTO.getFullName());
        customer.put("email", userDTO.getEmail());

        paymentLinkRequest.put("customer", customer);

        JSONObject notify = new JSONObject();
        notify.put("email", true);

        paymentLinkRequest.put("notify", notify);
        paymentLinkRequest.put("reminder_enable", true);
        paymentLinkRequest.put("callback_url", "http://localhost:3000/payment-success/"+orderId);

        paymentLinkRequest.put("callback_method", "get");

        return razorpayClient.paymentLink.create(paymentLinkRequest);
    }

    @Override
    public String createStripePaymentLink(UserDTO userDTO, Long amount, Long orderId) throws StripeException {
        Stripe.apiKey = STRIPE_SECRET_KEY;

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:3000/payment-success/"+orderId)
                .setCancelUrl("http://localhost:3000/payment-cancel")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("usd")
                                .setUnitAmount(amount * 100)
                                .setProductData(SessionCreateParams.
                                        LineItem.
                                        PriceData.
                                        ProductData.
                                        builder()
                                        .setName("Salon appointment booking").build()
                                ).build()
                        ).build()
                ).build();

        Session session = Session.create(params);

        return session.getUrl();
    }

    @Override
    public Boolean proceedPayment(PaymentOrder paymentOrder,
                                  String paymentId, String paymentLinkId) throws RazorpayException {

        if(paymentOrder.getStatus().equals(PaymentOrderStatus.PENDING)){

            if(paymentOrder.getPaymentMethod().equals(PaymentMethod.RAZORPAY)){

                RazorpayClient razorpay = new RazorpayClient(RAZORPAY_API_KEY, RAZORPAY_SECRET_KEY);
                Payment payment = razorpay.payments.fetch(paymentId);
                Integer amount = payment.get("amount");
                String status = payment.get("status");

                if(status.equals("captured")){
                    // Going to use Kafka and rabbit-queue for confirming status and
                    // creating the notification

                    paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                    paymentRepository.save(paymentOrder);
                    return true;
                }
                return false;
            }else{
                paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                paymentRepository.save(paymentOrder);
                return true;
            }
        }
        return false;
    }
}
