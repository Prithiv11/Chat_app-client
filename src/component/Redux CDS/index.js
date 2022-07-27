import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./mainSlice";

const store = configureStore({
  reducer: {
    chat: chatSlice.reducer,
  },
});

export default store;
