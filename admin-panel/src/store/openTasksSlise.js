import { createSlice } from "@reduxjs/toolkit";

const openTasksSlise=createSlice({
    name:"openTasks",
    initialState:{
        openTasks:[]
    },
    reducers:{
        setOpenTask(state,action){
            state.openTasks=action.payload
        }
        
    }
});
export const {setOpenTask}=openTasksSlise.actions
export default openTasksSlise.reducer