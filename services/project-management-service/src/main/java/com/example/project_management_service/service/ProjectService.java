package com.example.projectmanagementservice.service;

import com.example.projectmanagementservice.dto.ProjectDTO;
import com.example.projectmanagementservice.model.Project;
import com.example.projectmanagementservice.model.ProjectStatus;
import com.example.projectmanagementservice.repository.ProjectRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public Project getProjectById(UUID projectId) {
        return projectRepository.findById(projectId).orElse(null);
    }

    public Project createProject(ProjectDTO projectDTO) {
        Project project = new Project();
        project.setTitle(projectDTO.getTitle());
        project.setDescription(projectDTO.getDescription());
        project.setCategory(projectDTO.getCategory());
        project.setPrice(projectDTO.getPrice());
        project.setAllowHigherPrice(projectDTO.isAllowHigherPrice());
        project.setUserId(projectDTO.getUserId());
        project.setStatus(ProjectStatus.CREATED);
        return projectRepository.save(project);
    }

    public Project updateProject(UUID projectId, ProjectDTO projectDTO) {
        Optional<Project> projectOptional = projectRepository.findById(projectId);
        if (!projectOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
        }

        Project project = projectOptional.get();
        project.setTitle(projectDTO.getTitle());
        project.setDescription(projectDTO.getDescription());
        project.setCategory(projectDTO.getCategory());
        project.setPrice(projectDTO.getPrice());
        project.setAllowHigherPrice(projectDTO.isAllowHigherPrice());
        project.setStatus(projectDTO.getStatus());
        project.setUpdatedAt(LocalDateTime.now());

        return projectRepository.save(project);
    }
    
    public Project changeProjectStatus(UUID projectId, ProjectStatus newStatus) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));
        project.setStatus(newStatus);
        project.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }

    public List<Project> getProjectsByUserId(Long userId) {
        return projectRepository.findByUserId(userId);
    }

    public List<Project> getAllProjectsSortedByDate() {
        return projectRepository.findAllByOrderByCreatedAtDesc();
    }

    // Additional methods for retrieving, updating, and deleting projects can be added here
}
