# Для запуска сервиса нужно:
## Перейти в директорию сервиса:
    cd freelance-platform\services\search-service
### Выполнить команды:
    docker build -t localhost:5000/search-service:latest .
    docker push localhost:5000/search-service:latest
    kubectl apply -f ../../infrastructure/kubernetes/search-service-deployment.yaml

#### Перезапуск сервиса (если нужно):
    kubectl rollout restart deployment/search-service



Структура сервиса:
    cmd:
        server:
            main.go
    config:
        config.yaml
    docs:
        api_documentation.md
    internal:
        handler:
            search_handler.go
        model:
            project.go
        repository:
            elastic_repository.go
        router:
            router.go
        service:
            search_service.go
    Dockerfile
    go.mod
    go.sum
    README.md