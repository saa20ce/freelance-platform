package handler

import (
    "net/http"
    "search-service/internal/service"
    "github.com/gin-gonic/gin"
)

type SearchHandler struct {
    searchService *service.SearchService
}

func NewSearchHandler(service *service.SearchService) *SearchHandler {
    return &SearchHandler{searchService: service}
}

func (h *SearchHandler) SearchProjects(c *gin.Context) {
    query := c.Query("q")
    projects, err := h.searchService.SearchProjects(query)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
        return
    }
    c.JSON(http.StatusOK, projects)
}
