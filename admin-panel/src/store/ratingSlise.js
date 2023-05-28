import { createSlice } from "@reduxjs/toolkit";

const ratingSlise=createSlice({
    name:"rating",
    initialState:{
        rating:{        }
    },
    reducers:{
        setRating(state,action){
            state.rating={
                year:action.payload.year_avg,
                month:action.payload.month_avg,
                week:action.payload.day_avg
             }

        }
        
    }
});
export const {setRating}=ratingSlise.actions
export default ratingSlise.reducer