package com.ayush.reviewservice.service;

import com.ayush.reviewservice.dto.ReviewRequest;
import com.ayush.reviewservice.dto.SalonDTO;
import com.ayush.reviewservice.dto.UserDTO;
import com.ayush.reviewservice.model.Review;
import com.ayush.reviewservice.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{

    private final ReviewRepository reviewRepository;

    @Override
    public Review createReview(ReviewRequest reviewRequest, UserDTO userDTO, SalonDTO salonDTO) {

        Review review = new Review();
        review.setReviewText(reviewRequest.getReviewText());
        review.setRating(reviewRequest.getRating());
        review.setUserId(userDTO.getId());
        review.setSalonId(salonDTO.getId());


        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsBySalonId(Long salonId) {
        return reviewRepository.findBySalonId(salonId);
    }

    @Override
    public Review updateReview(ReviewRequest reviewRequest, Long reviewId, Long userId) {
        Review review =
                reviewRepository.findById(reviewId).orElseThrow(()->
                        new RuntimeException("Review not exit"));

        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this review");
        }

        review.setReviewText(reviewRequest.getReviewText());
        review.setRating(reviewRequest.getRating());

        return reviewRepository.save(review);
    }

    @Override
    public void deleteReview(Long reviewId, Long userId) {
        Review review =
                reviewRepository.findById(reviewId).orElseThrow(()->
                        new RuntimeException("Review not exit"));

        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this review");
        }

        reviewRepository.delete(review);
    }
}
