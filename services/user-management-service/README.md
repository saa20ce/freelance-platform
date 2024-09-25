# Для запуска сервиса нужно:
## Перейти в директорию сервиса:
    cd freelance-platform\services\user-management-service
### Выполнить команды:
    docker build -t localhost:5000/user-management-service:latest .
    docker push localhost:5000/user-management-service:latest
    kubectl apply -f ../../infrastructure/kubernetes/user-management-service-deployment.yaml

#### Перезапуск сервиса (если нужно):
    kubectl rollout restart deployment/user-management-service




Структура сервиса:
    app:
        init.py
        crud.py
        database.py
        main.py
        models.py
        schemas.py
        test.py
    alembic.ini
    docker-compose.yml
    Dockerfile
    README.md
    requirements.txt