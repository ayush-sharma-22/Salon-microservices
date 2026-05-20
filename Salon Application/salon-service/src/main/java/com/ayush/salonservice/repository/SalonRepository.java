package com.ayush.salonservice.repository;

import com.ayush.salonservice.model.Salon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalonRepository extends JpaRepository<Salon,Long> {
    Salon findSalonById(Long salonId);

    @Query(
            "SELECT s FROM Salon s WHERE " +
                    "(LOWER(s.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                    "LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                    "LOWER(s.address) LIKE LOWER(CONCAT('%', :keyword, '%')))"
    )
    List<Salon> SearchSalons(@Param("keyword")  String keyword);

    List<Salon> findByOwnerId(Long ownerId);
}
