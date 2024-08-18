package com.example.projectmanagementservice.repository;

import com.example.projectmanagementservice.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    // Custom queries can be added here if needed
    List<Project> findByUserId(Long userId);
}
