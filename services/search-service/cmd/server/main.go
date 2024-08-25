package main

import (
    "search-service/internal/router"
    "log"
)

func main() {
    r := router.SetupRouter()
    if err := r.Run(":3004"); err != nil {
        log.Fatalf("Failed to run server: %v", err)
    }
}
