import { configureStore } from "@reduxjs/toolkit";
import connectionSlice from "./connectionSlice";
import menuSlice from "./menuSlice";

export const store = configureStore({
    reducer: {
        connectionState: connectionSlice,
        changeMenuState: menuSlice
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch;