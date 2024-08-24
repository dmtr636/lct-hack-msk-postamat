# Сервис обработки обратной связи пользователей «Московского постамата»

![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Keras](https://img.shields.io/badge/Keras-%23D00000.svg?style=for-the-badge&logo=Keras&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Gunicorn](https://img.shields.io/badge/gunicorn-%298729.svg?style=for-the-badge&logo=gunicorn&logoColor=white)

## Структура сервиса

- **admin-panel** - Админ-панель. Реализована в виде веб-приложения на React. Предоставляет необходимый функционал для работы со всеми сущностями системы (постаматы, отзывы, задачи, аналитика, пользователи)
- **backend** - Бекенд, предоставляющий REST API для всех компонентов системы 
- **model** - Модель для определения категории отзывов
- **telegram-bot** - Телеграм бот, предоставляющей пользователям возможность оставить обратную связь в свободной форме
- **widget** - Виджет, реализованный в виде встраиваего веб-пприложения и предназначенный для сбора обратной связи на экранах постаматов

## Используемые технологии

- Frontend: **React, Mobx**
- Backend: **Django, Django Rest Framework**
- База данных: **MySQL**
- Библиотеки для машинного обучения: **Keras, Tensorflow**
- Веб-сервер: **Nginx, Gunicorn**

## Описание модели

Для определения категорий отзывов была разработана модель на основе рекуррентной нейронной сети LSTM. Ниже приведена архитектура модели.

![image](https://github.com/user-attachments/assets/ce847a2f-d58a-4431-afde-c316b932caa7)

Данная модель принимает на вход текст комментария отзыва (предварительно преобразованный в последовательность токенов) и определяет по нему вероятности принадлежности отзыва к определенным категориям. 

На основании полученных вероятностей к каждому отзыву присваивается список категорий. Затем специальный алгоритм определяет необходимость формирования задачи для данного отзыва, используя полученный список категорий и оценку отзыва.

Для обучения данной модели необходимо было сформировать датасет, содержащий информацию о принадлежности отзывов к определённым категориям.

Для этого были составлены списки ключевых и стоп слов, и с помощью python скрипта был сформирован требуемый датасет, который затем был использован для обучения разработанной модели.

В результате обучения модели была получена точность в 80%.
