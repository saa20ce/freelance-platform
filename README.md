# freelance-platform

# start frontend app
cd frontend
npm start


# recreate service docker image:
## Перейдите в директорию auth-service
cd ../auth-service

## Постройте новый Docker-образ
docker build -t localhost:5000/auth-service:latest .

## Запушьте образ в локальный регистр
docker push localhost:5000/auth-service:latest

## Перезапуск сервиса
kubectl rollout restart deployment/auth-service


## Перейдите в директорию user-management-service
cd ../user-management-service

## Постройте новый Docker-образ
docker build -t localhost:5000/user-management-service:latest .

## Запушьте образ в локальный регистр
docker push localhost:5000/user-management-service:latest

## Перезапуск сервиса
kubectl rollout restart deployment/user-management-service


## Перейдите в директорию project-management-service
cd ../project-management-service

## Постройте новый Docker-образ
docker build -t localhost:5000/project-management-service:latest .

## Запушьте образ в локальный регистр
docker push localhost:5000/project-management-service:latest

## Перезапуск сервиса
kubectl rollout restart deployment/project-management-service


## Перейдите в директорию search-service
cd ../search-service

## Постройте новый Docker-образ
docker build -t localhost:5000/search-service:latest .

## Запушьте образ в локальный регистр
docker push localhost:5000/search-service:latest

## Перезапуск сервиса
kubectl rollout restart deployment/search-service


## Посмотреть поды
kubectl get pods

## Перезапуск пода
kubectl delete pod 


## redirect port forward:
kubectl port-forward svc/auth-service 3001:3001 

kubectl port-forward svc/user-management-service 3002:3002


## user-management service container logs
kubectl exec -it user-management-service-79495b99f5-77bjs -- cat /app/logs.txt


## update kubectl manifest
kubectl apply -f infrastructure/kubernetes/project-postgresql-deployment.yaml
