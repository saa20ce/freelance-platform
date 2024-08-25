package com.example.projectmanagementservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Positive;
import com.example.projectmanagementservice.model.ProjectStatus;

import java.math.BigDecimal;
import java.util.UUID;

public class ProjectDTO {
    
    @NotNull
    @Size(max = 55)
    private String title;

    @NotNull
    @Size(max = 1000)
    private String description;

    @NotNull
    @Size(max = 50)
    private String category;

    @NotNull
    @Positive
    private BigDecimal price;

    private boolean allowHigherPrice;

    @NotNull
    private Long userId;

    @NotNull
    private ProjectStatus status;

    // Getters and setters

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public boolean isAllowHigherPrice() {
        return allowHigherPrice;
    }

    public void setAllowHigherPrice(boolean allowHigherPrice) {
        this.allowHigherPrice = allowHigherPrice;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }
}
