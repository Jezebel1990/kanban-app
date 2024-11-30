import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
 currentBoardName: "",
 };

   export const features = createSlice({
    // Name of the slice
    name: "features",
    initialState,
   
    reducers: {
     setCurrentBoardName: (state, action: PayloadAction<string>) => {
       state.currentBoardName = action.payload;
     },
    },
    });

      // Export the functions defined inside the reducers here
    export const { setCurrentBoardName } = features.actions;

    // Selector function to retrieve the current board name from the state
   export const getCurrentBoardName = (state: RootState) => state.features.currentBoardName;

   // Export the reducer for use in the Redux store
   export default features.reducer;