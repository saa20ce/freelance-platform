# Для запуска сервиса нужно:
## Перейти в директорию сервиса:
    cd freelance-platform\services\auth-service
### Выполнить команды:
    docker build -t localhost:5000/auth-service:latest .
    docker push localhost:5000/auth-service:latest
    kubectl apply -f ../../infrastructure/kubernetes/auth-service-deployment.yaml
#### Перезапуск сервиса(если нужно):
    kubectl rollout restart deployment/auth-service


Файловая стпуктура сервиса:

auth-service:
    src:
        controllers:
            authController.js
        middleware:
            authMiddleware.js
        routes:
            authRoutes.js
    app.js
    .eslintrc.js
    .gitignore
    .prettierrc
    docker-compose.yml
    Dockerfile
    index.js
    package-lock.json
    package.json
    README.md