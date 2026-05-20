package com.ayush.categoryservice.service;

import com.ayush.categoryservice.dto.CategoryDTO;
import com.ayush.categoryservice.dto.SalonDTO;
import com.ayush.categoryservice.model.Category;

import java.util.List;
import java.util.Set;

public interface CategoryService {
    Category createCategory(CategoryDTO categoryDTO, SalonDTO salonDTO);

    List<Category> getAllCategories();

    Set<Category> getCategoruesBySalonId(Long id);

    Category getCategoryById(Long id);

    Category deleteCategoryById(Long id);
}
