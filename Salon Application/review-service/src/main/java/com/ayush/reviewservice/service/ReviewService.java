package com.ayush.reviewservice.service;

import com.ayush.reviewservice.dto.ReviewRequest;
import com.ayush.reviewservice.dto.SalonDTO;
import com.ayush.reviewservice.dto.UserDTO;
import com.ayush.reviewservice.model.Review;

import java.util.List;

public interface ReviewService {
    Review createReview(ReviewRequest reviewRequest,
                        UserDTO userDTO,
                        SalonDTO salonDTO);


    List<Review> getReviewsBySalonId(Long salonId);

    Review updateReview(ReviewRequest reviewRequest,
                        Long reviewId,
                        Long userId);

    void deleteReview(Long reviewId, Long userId);

}
