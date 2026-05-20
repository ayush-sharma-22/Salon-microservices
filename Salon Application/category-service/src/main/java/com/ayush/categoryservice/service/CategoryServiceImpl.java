package com.ayush.categoryservice.service;

import com.ayush.categoryservice.dto.CategoryDTO;
import com.ayush.categoryservice.dto.SalonDTO;
import com.ayush.categoryservice.model.Category;
import com.ayush.categoryservice.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService{

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public Category createCategory(CategoryDTO categoryDTO, SalonDTO salonDTO) {
        Category category = modelMapper.map(categoryDTO,Category.class);

        Category newCategory = new Category();
        newCategory.setName(category.getName());
        newCategory.setImage(category.getImage());
        newCategory.setSalonId(salonDTO.getId());
        return categoryRepository.save(newCategory) ;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Set<Category> getCategoruesBySalonId(Long id) {
        return categoryRepository.findBySalonId(id);
    }

    @Override
    public Category getCategoryById(Long id) {

        return categoryRepository.findById(id).orElse(null);
    }

    @Override
    public Category deleteCategoryById(Long id) {
        Category existingCategory = categoryRepository.findById(id).orElse(null);
        if(existingCategory!=null && Objects.equals(existingCategory.getSalonId(), id)){
            categoryRepository.deleteById(id);
            return existingCategory;
        }
        throw new RuntimeException("Category with id "+id+" not found");
    }
}
