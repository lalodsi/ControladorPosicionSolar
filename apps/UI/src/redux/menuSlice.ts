import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type menuType = "none" | "MonitoringData" | "MonitoringGraphics";
type menuChangeType = "none" | "Error" | "Loading";

type menuStateType = {
    actual: menuType
    next: menuType,
    state: menuChangeType
}

const menuInitialState: menuStateType = {
    actual: "none",
    next: "none",
    state: "none"
}

export const menuSlice = createSlice({
    name: "menu",
    initialState: menuInitialState,
    reducers: {
        changeMenu: (state, action: PayloadAction<menuType>) => {
            state.actual = "none"
            state.next = action.payload
            state.state = "Loading"
        }
    }
})

export const { changeMenu } = menuSlice.actions;

export default menuSlice.reducer;