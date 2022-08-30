import { createSlice } from '@reduxjs/toolkit';
import { Personnel } from '../../entities/transaction/Personnel';
interface State {
  personnels: Personnel[];
}
const initialState: State = {
  personnels: [],
};
const personnelSlice = createSlice({
  name: 'personnel',
  initialState: initialState,
  reducers: {
    fill(state, action) {
      state.personnels = action.payload;
    },
  },
});

export const personnelActions = personnelSlice.actions;
export default personnelSlice;
