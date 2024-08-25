package router

import (
    "search-service/internal/handler"
    "search-service/internal/repository"
    "search-service/internal/service"
    "github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
    r := gin.Default()

    elasticRepo := repository.NewElasticRepository("http://elasticsearch:9200", "projects")

    searchService := service.NewSearchService(elasticRepo)

    searchHandler := handler.NewSearchHandler(searchService)

    r.GET("/search", searchHandler.SearchProjects)

    return r
}
