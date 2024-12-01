import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
 currentBoardName: "",
 isAddAndEditBoardModal: { isOpen: false, variant: "" },
 };

   export const features = createSlice({
    // Name of the slice
    name: "features",
    initialState,
   
    reducers: {
     setCurrentBoardName: (state, action: PayloadAction<string>) => {
       state.currentBoardName = action.payload;
     },
     openAddAndEditBoardModal: (state, { payload }) => {
        state.isAddAndEditBoardModal.isOpen = true;
        state.isAddAndEditBoardModal.variant = payload;
    },
    closeAddAndEditBoardModal: (state) => {
        state.isAddAndEditBoardModal.isOpen = false;
        state.isAddAndEditBoardModal.variant = "";
      },
    },
});

      // Export the functions defined inside the reducers here
    export const { 
        setCurrentBoardName,
        openAddAndEditBoardModal,
        closeAddAndEditBoardModal, 
    } = features.actions;

    // Selector function to retrieve the current board name from the state
   export const getCurrentBoardName = (state: RootState) => state.features.currentBoardName;
   export const getAddAndEditBoardModalValue = (state: RootState) => state.features.isAddAndEditBoardModal.isOpen;
   export const getAddAndEditBoardModalVariantValue = (state: RootState) => state.features.isAddAndEditBoardModal.variant;
   // Export the reducer for use in the Redux store
   export default features.reducer;