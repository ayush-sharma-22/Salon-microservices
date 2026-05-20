package com.ayush.categoryservice.repository;

import com.ayush.categoryservice.model.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {

    Set<Category> findBySalonId(Long id);
}
