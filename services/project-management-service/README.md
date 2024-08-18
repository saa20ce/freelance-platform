# build project
./gradlew build -x test 

## Перейдите в директорию project-management-service
cd ../project-management-service

## Постройте новый Docker-образ
docker build -t localhost:5000/project-management-service:latest .

## Запушьте образ в локальный регистр
docker push localhost:5000/project-management-service:latest

## Перезапуск сервиса
kubectl rollout restart deployment/project-management-service