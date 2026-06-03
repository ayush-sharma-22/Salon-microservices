package com.ayush.payment.controller;

import com.ayush.payment.enums.PaymentMethod;
import com.ayush.payment.enums.PaymentOrderStatus;
import com.ayush.payment.model.PaymentOrder;
import com.ayush.payment.payload.dto.BookingDTO;
import com.ayush.payment.payload.dto.UserDTO;
import com.ayush.payment.payload.response.PaymentLinkResponse;
import com.ayush.payment.service.PaymentService;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Value("${stripe.api.secret}")
    private String STRIPE_SECRET_KEY;

    @Value("${stripe.api.key}")
    private String STRIPE_API_KEY;

    @Value("${razorpay.api.secret}")
    private String RAZORPAY_SECRET_KEY;

    @Value("${razorpay.api.key}")
    private String RAZORPAY_API_KEY;

    @PostMapping("/create")
    ResponseEntity<PaymentLinkResponse> createPaymentLink(@RequestBody BookingDTO bookingDTO,
                                                          @RequestParam PaymentMethod paymentMethod) throws StripeException, RazorpayException {

        UserDTO userDTO = new UserDTO();
        userDTO.setId(10L);
        userDTO.setUsername("ayush");
        userDTO.setEmail("as89sharma98@gmail.com");

        PaymentLinkResponse paymentLinkResponse = paymentService.createOrder(userDTO, bookingDTO,paymentMethod);
        return ResponseEntity.ok(paymentLinkResponse);

    }

    @GetMapping("/{paymentOrderId}")
    ResponseEntity<PaymentOrder> getPaymentOrderById(@PathVariable Long paymentOrderId) throws Exception {

        PaymentOrder order= paymentService.getPaymentOrderById(paymentOrderId);
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/proceed")
    ResponseEntity<Boolean> proceedPayment(@RequestParam String paymentId,
                                           @RequestParam String paymentLinkId)
            throws Exception {

        PaymentOrder paymentOrder = paymentService.getPaymentOrderByPaymentLinkId(paymentLinkId);
        Boolean order= paymentService.proceedPayment(paymentOrder, paymentId, paymentLinkId);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/debug/payment-link/{paymentLinkId}")
    public ResponseEntity<String> debugPaymentLink(
            @PathVariable String paymentLinkId)
            throws Exception {

        RazorpayClient razorpay =
                new RazorpayClient(
                        RAZORPAY_API_KEY,
                        RAZORPAY_SECRET_KEY
                );

        JSONObject params = new JSONObject();
        params.put("payment_link_id", paymentLinkId);

        List<Payment> payments =
                razorpay.payments.fetchAll(params);

        if (payments.isEmpty()) {
            return ResponseEntity.ok("No payments found");
        }

        for (Payment payment : payments) {

            System.out.println(
                    "Payment ID = " + payment.get("id")
            );

            System.out.println(
                    "Status = " + payment.get("status")
            );
        }

        return ResponseEntity.ok("Check console");
    }

}
