import { createSlice } from "@reduxjs/toolkit";

const inProgressTasksSlise=createSlice({
    name:"inProgressTasks",
    initialState:{
        inProgressTasks:[]
    },
    reducers:{
        setInProgressTask(state,action){
            state.inProgressTasks=action.payload
            
        }
        
    }
});
export const {setInProgressTask}=inProgressTasksSlise.actions
export default inProgressTasksSlise.reducer