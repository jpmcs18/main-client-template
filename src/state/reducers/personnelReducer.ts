import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Personnel from '../../entities/transaction/Personnel';
interface State {
  personnels: Personnel[];
  selectedPersonnel?: Personnel | undefined;
  showManagementModal: boolean;
}
const initialState: State = {
  personnels: [],
  showManagementModal: false,
};
const personnelSlice = createSlice({
  name: 'personnel',
  initialState: initialState,
  reducers: {
    fill(state, action: PayloadAction<Personnel[]>) {
      state.personnels = action.payload;
    },
    add(state) {
      state.selectedPersonnel = undefined;
      state.showManagementModal = true;
    },
    edit(state) {
      state.showManagementModal = true;
    },
    select(state, action: PayloadAction<Personnel>) {
      state.selectedPersonnel = action.payload;
    },
    closeManagementModal(state) {
      state.showManagementModal = false;
    },
  },
});

export const personnelActions = personnelSlice.actions;
export default personnelSlice;
