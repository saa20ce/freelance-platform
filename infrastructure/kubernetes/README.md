# Для применения манифестов нужно:
## Перейдите в директорию: cd freelance-platform\infrastructure\kubernetes
### Примените команды:
        kubectl apply -f ../../infrastructure/kubernetes/elasticsearch-deployment.yaml
        kubectl apply -f ../../infrastructure/kubernetes/project-postgresql-deployment.yaml
        kubectl apply -f ../../infrastructure/kubernetes/user-postgresql-deployment.yaml