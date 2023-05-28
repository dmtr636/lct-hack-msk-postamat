import { createSlice } from "@reduxjs/toolkit";

const searchSlise=createSlice({
    name:"search",
    initialState:{
        tasks:[],
        reviews:[],
    reducers:{
        setSearchTask(state,action){
            state.tasks=action.payload
            
        },
        setSearchReviews(state,action){
            state.rating=action.payload
            
        }
        
    }
}});
export const {setSearchReviews,setSearchTask}=searchSlise.actions
export default searchSlise.reducer