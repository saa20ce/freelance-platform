package repository

import (
    //"context"
    "github.com/olivere/elastic/v7"
    "log"
    "search-service/internal/model"
)

type ElasticRepository struct {
    client *elastic.Client
    index  string
}

func NewElasticRepository(url, index string) *ElasticRepository {
    client, err := elastic.NewClient(elastic.SetURL(url))
    if err != nil {
        log.Fatalf("Error creating Elasticsearch client: %v", err)
    }
    return &ElasticRepository{client: client, index: index}
}

func (r *ElasticRepository) SearchProjects(query string) ([]model.Project, error) {
    // Логика поиска по Elasticsearch
    return nil, nil
}
