import React from "react";
import {MainPage} from "../pages/MainPage/MainPage";
import {AccessPage} from "../pages/AccessPage/AccessPage";
import {ReviewListPage} from "../pages/ReviewListPage/ReviewListPage";
import {AnalyticsPage} from "../pages/AnalyticsPage/AnalyticsPage";
import {Access, Analytics, comments, main, postamats, Tasks} from "../assets/img";
import {PostamatListPage} from "../pages/PostamatListPage/PostamatListPage";
import {TaskListPage} from "../pages/TaskListPage/TaskListPage";


export const navRoutes = [
    {
        path: "/",
        element: <MainPage/>,
        icon: main,
        name: "Главная"
    },
    {
        path: "/postamats",
        element: <PostamatListPage/>,
        icon: postamats,
        name: "Постаматы"
    },
    {
        path: "/reviews",
        element: <ReviewListPage/>,
        icon: comments,
        name: "Отзывы"
    },
    {
        path: "/tasks",
        element: <TaskListPage/>,
        icon: Tasks,
        name: "Задачи"
    },
    {
        path: "/analytics",
        element: <AnalyticsPage/>,
        icon: Analytics,
        name: "Аналитика"
    },
    {
        path: "/Access",
        element: <AccessPage/>,
        icon: Access,
        name: "Доступы"
    },
];
