package service

import (
    "search-service/internal/model"
    "search-service/internal/repository"
)

type SearchService struct {
    repository *repository.ElasticRepository
}

func NewSearchService(repo *repository.ElasticRepository) *SearchService {
    return &SearchService{repository: repo}
}

func (s *SearchService) SearchProjects(query string) ([]model.Project, error) {
    return s.repository.SearchProjects(query)
}
