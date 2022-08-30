import { configureStore } from '@reduxjs/toolkit';
import personnelSlice from './reducers/personnelReducer';
import userSlice from './reducers/userReducer';
const store = configureStore({
  reducer: {
    personnel: personnelSlice.reducer,
    user: userSlice.reducer,
  },
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
