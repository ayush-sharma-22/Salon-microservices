package com.ayush.payment.repository;

import com.ayush.payment.model.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentOrder, Long> {
      PaymentOrder findByPaymentLinkId(String paymentLinkId);

}
