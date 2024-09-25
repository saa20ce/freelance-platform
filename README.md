# freelance-platform

# Перед первым запуском нужно:
    1.Запустить Docker Desktop
    2.Создать контейнер:
        cd freelance-platform
        docker run -d -p 5000:5000 --name registry registry:2
    3.Поднять сервисы:
        Как поднять сервисы смотрите README в freelance-platform\services\Папка сервиса\README
    4.Применить манифесты:
        Как применить манифесты смотрите README в freelance-platform\infrastructure\kubernetes\README

## Запуск frontend
    cd freelance-platform\frontend
    npm start
    kubectl get pods
    kubectl port-forward svc/auth-service 3001:3001 






## Посмотреть поды
kubectl get pods

## Перезапуск пода
kubectl delete pod 


## user-management service container logs
kubectl exec -it user-management-service-79495b99f5-77bjs -- cat /app/logs.txt
