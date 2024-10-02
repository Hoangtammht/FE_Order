import { createSlice } from "@reduxjs/toolkit";
import { localDataNames } from "../../constants/appInfos";

export interface AuthState {
    access_token: string,
    userID: number,
    userName: string,
    fullName: string,
    role: number
}

const initialState = {
    access_token: '',
    userID: 0,
    userName: '',
    fullName: '',
    role: 0
}

const authSlice = createSlice({
    name: 'auth',
    initialState:{
        data: initialState
    },
    reducers: {
        addAuth: (state, action) => {
            state.data = action.payload
            syncLocal(action.payload);
        },
        removeAuth: (state, action) => {
            state.data = initialState
            syncLocal({});
        }
    }
})

export const authReducer = authSlice.reducer
export const {addAuth, removeAuth} = authSlice.actions

export const authSelector = (state: any) => state.authReducer.data

const syncLocal = (data:any) => {
    localStorage.setItem(
        localDataNames.authData,
        JSON.stringify(data)
    )
}