package com.ayush.reviewservice.controller;

import com.ayush.reviewservice.dto.ApiResponse;
import com.ayush.reviewservice.dto.ReviewRequest;
import com.ayush.reviewservice.dto.SalonDTO;
import com.ayush.reviewservice.dto.UserDTO;
import com.ayush.reviewservice.model.Review;
import com.ayush.reviewservice.service.ReviewService;
import com.ayush.reviewservice.service.client.SalonFeignClient;
import com.ayush.reviewservice.service.client.UserFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserFeignClient userFeignClient;
    private final SalonFeignClient salonFeignClient;

    @PostMapping("/create/salon/{salonId}")
    public ResponseEntity<Review> createReview(@PathVariable Long salonId,
                                               @RequestBody ReviewRequest reviewRequest,
                                               @RequestHeader("Authorization") String jwt){

        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();
        SalonDTO salonDTO = salonFeignClient.getSalonById(salonId).getBody();

        Review createdReview = reviewService.createReview(reviewRequest,userDTO,salonDTO);
        return ResponseEntity.ok(createdReview);
    }

    @GetMapping("/salon/{salonId}")
    public ResponseEntity<List<Review>> getReviewBySalonId(@PathVariable Long salonId,
                                               @RequestHeader("Authorization") String jwt){

        SalonDTO salonDTO = salonFeignClient.getSalonById(salonId).getBody();

        if(salonDTO == null){
            throw new RuntimeException("user not permitted to update review");
        }

        List<Review> createdReview = reviewService.getReviewsBySalonId(salonDTO.getId());
        return ResponseEntity.ok(createdReview);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(@PathVariable Long reviewId,
                                                     @RequestBody ReviewRequest reviewRequest,
                                                     @RequestHeader("Authorization") String jwt){

        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();

        if(userDTO == null){
            throw new RuntimeException("user not permitted to update review");
        }

        Review createdReview = reviewService.updateReview(reviewRequest,reviewId,userDTO.getId());
        return ResponseEntity.ok(createdReview);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(@PathVariable Long reviewId,
                                               @RequestHeader("Authorization") String jwt){

        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();

        if(userDTO == null){
            throw new RuntimeException("user not permitted to update review");
        }

       reviewService.deleteReview(reviewId, userDTO.getId());

        ApiResponse response = new ApiResponse();
        response.setMessage("review deleted");

        return ResponseEntity.ok(response);
    }
}
