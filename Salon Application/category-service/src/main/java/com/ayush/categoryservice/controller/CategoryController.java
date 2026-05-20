package com.ayush.categoryservice.controller;

import com.ayush.categoryservice.dto.CategoryDTO;
import com.ayush.categoryservice.dto.SalonDTO;
import com.ayush.categoryservice.model.Category;
import com.ayush.categoryservice.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/categories")
public class CategoryController {
    private final CategoryService categoryService;
    private final ModelMapper modelMapper;

    @PostMapping("/salon-owner")
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryDTO categoryDTO) {
        SalonDTO salonDTO = new SalonDTO();
        salonDTO.setId(1L);
        Category category = categoryService.createCategory(categoryDTO, salonDTO);
        CategoryDTO result = modelMapper.map(category, CategoryDTO.class);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        List<CategoryDTO> result = categories.stream().map((category -> {
            return modelMapper.map(category, CategoryDTO.class);

        })).toList();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/salon/{id}")
    public ResponseEntity<Set<CategoryDTO>> getAllCategoriesBySalons(@PathVariable Long id) {
        Set<Category> categories = categoryService.getCategoruesBySalonId(id);
        Set<CategoryDTO> result = categories.stream()
                .map(category -> modelMapper.map(category, CategoryDTO.class))
                .collect(Collectors.toSet());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        CategoryDTO result = modelMapper.map(category, CategoryDTO.class);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/salon-owner/{id}")
    public ResponseEntity<CategoryDTO> deleteCategoryById(@PathVariable Long id) {
        Category category = categoryService.deleteCategoryById(id);
        CategoryDTO result = modelMapper.map(category, CategoryDTO.class);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
