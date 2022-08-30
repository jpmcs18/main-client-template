import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../entities/user/User';

interface State {
  users: User[];
}
const initialState: State = {
  users: [],
};
const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    fill(state, action) {
      state.users = action.payload;
    },
    activate(state, action) {
      state.users = state.users.map((user) => {
        if (user.id === action.payload.id && action.payload.active !== null) {
          user.active = action.payload.active;
        }
        return user;
      });
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice;
