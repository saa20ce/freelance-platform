package com.example.projectmanagementservice.service;

import com.example.projectmanagementservice.dto.ProjectDTO;
import com.example.projectmanagementservice.model.Project;
import com.example.projectmanagementservice.model.ProjectStatus;
import com.example.projectmanagementservice.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

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

    public List<Project> getProjectsByUserId(Long userId) {
        return projectRepository.findByUserId(userId);
    }

    // Additional methods for retrieving, updating, and deleting projects can be added here
}
