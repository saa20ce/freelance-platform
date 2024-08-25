package com.example.projectmanagementservice.controller;

import com.example.projectmanagementservice.dto.ProjectDTO;
import com.example.projectmanagementservice.model.Project;
import com.example.projectmanagementservice.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity<Project> createProject(@RequestBody ProjectDTO projectDTO) {
        Project createdProject = projectService.createProject(projectDTO);
        return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
    }

    // TODO: add nav to projectList 
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Project>> getProjectsByUserId(@PathVariable Long userId) {
        List<Project> projects = projectService.getProjectsByUserId(userId);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectById(@PathVariable UUID projectId) {
        Project project = projectService.getProjectById(projectId);
        if (project != null) {
            return ResponseEntity.ok(project);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<Project> updateProject(@PathVariable UUID projectId, @RequestBody ProjectDTO projectDTO) {
        Project updatedProject = projectService.updateProject(projectId, projectDTO);
        return ResponseEntity.ok(updatedProject);
    }

    @PostMapping("/{projectId}/status")
    public ResponseEntity<Project> changeProjectStatus(@PathVariable UUID projectId, @RequestBody ProjectDTO projectDTO) {
        Project updatedProject = projectService.changeProjectStatus(projectId, projectDTO.getStatus());
        return ResponseEntity.ok(updatedProject);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Project>> searchProjects() {
        List<Project> projects = projectService.getAllProjectsSortedByDate();
        return ResponseEntity.ok(projects);
    }

    // Other endpoints like getProject, updateProject, deleteProject can be added here
}
