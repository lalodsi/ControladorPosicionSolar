import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

type connectionType = {
    connected: boolean,
    loading: boolean,
    error: boolean,
}

const connectionInitialState: connectionType = {
    connected: false,
    loading: false,
    error: false
}

export const connectionSlice = createSlice({
    name: "connection",
    initialState: connectionInitialState,
    reducers: {
        connecting: state => {
            state.connected = false;
            state.loading = true;
            state.error = false;
        },
        connected: state => {
            state.connected = true
            state.loading = false;
            state.error = false;
        },
        disconnected: state => {
            state.connected = false
            state.loading = false;
            state.error = false;
        },
        error: (state, action: PayloadAction<string>) => {
            state.connected = false
            state.loading = false;
            state.error = true;
            console.log(action.payload);
        },
    }
})

export const { connected, disconnected, connecting } = connectionSlice.actions;

export default connectionSlice.reducer;