import { configureStore } from "@reduxjs/toolkit";
import authReduser from "./authSlise";
import usersReduser from "./usersSlise";
import ratingSlise from "./ratingSlise";
import openTasksSlise from "./openTasksSlise";
import inProgressTasksSlise from "./inProgressTasksSlise";
export const store = configureStore({
  reducer: { 
    auth: authReduser, 
    users:usersReduser,
    rating: ratingSlise,
    openTasks:openTasksSlise,
    inProgressTasks:inProgressTasksSlise,
  },
});
