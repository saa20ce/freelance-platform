# Для запуска сервиса нужно:

## Важно! Для корректной работы сервиса нужно:
    перейти по ссылке:https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
    Выберите установочный файл для Windows или вашей ситсемы (например, .exe файл).
    Скачайте и запустите установочный файл.
    Следуйте инструкциям на экране, чтобы завершить установку.
    После установки добавьте путь к JDK в переменные среды:
    Откройте свойства системы.
    Перейдите на вкладку Дополнительно и нажмите на Переменные среды.
    Найдите переменную Path и добавьте путь к каталогу bin вашей установки JDK (например, C:\Program Files\Java\jdk-17\bin).
    В терминале:
        Проверьте установку, открыв командную строку и введя:
            java -version
    Перезапустите редактор кода

### Перейти в директорию сервиса:
    cd freelance-platform\services\user-management-service
#### Выполнить команды:
    .\gradlew wrapper
    cd freelance-platform\services\project-management-service
    docker build -t localhost:5000/project-management-service:latest .
    docker push localhost:5000/project-management-service:latest
    kubectl apply -f ../../infrastructure/kubernetes/project-management-service-deployment.yaml
##### Перезапуск сервиса(если нужно):
    kubectl rollout restart deployment/project-management-service



Файловая структура сервиса:

project-management-service:
    .gradle
    build
    gradle:
        wrapper:
            gradle-wrapper.jar
            gradle-wrapper.properties
    src:
        main: ...
        test: ...
        build.gradle
        docker-compose.yml
        Dockerfile













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