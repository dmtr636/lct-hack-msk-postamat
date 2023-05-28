import { createSlice } from "@reduxjs/toolkit";

const authSlise=createSlice({
    name:"auth",
    initialState:{
        auth:{
            id: null,
            email: "",
            name: "",
            role: "",
            isAuthenticated:false
        }
    },
    reducers:{
        setAuth(state,action){
            state.auth.id=action.payload.id
            state.auth.email=action.payload.email
            state.auth.name=action.payload.name
            state.auth.role=action.payload.role
            state.auth.isAuthenticated=true
           
        },
        logOutUser(state){
            state.auth.id=null
            state.auth.email=""
            state.auth.name=""
            state.auth.role=""
            state.auth.isAuthenticated=false
        }
    }
});
export const {setAuth,logOutUser}=authSlise.actions
export default authSlise.reducer