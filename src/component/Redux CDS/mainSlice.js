import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const chatSlice = createSlice({
  name: "chatapp",
  initialState: {
    currentUser: {},
    currentChat: {},
    currentChatMessages: [],
    inputBox: "",
    allUsers: [],
  },
  reducers: {
    setCurrentUser(state, actions) {
      state.currentUser = actions.payload;
    },
    changeChat(state, actions) {
      state.currentChat = actions.payload;
    },
    setCurrentChatMessages(state, actions) {
      state.currentChatMessages = actions.payload;
    },
    updateCurrentChatMessages(state, actions) {
      console.log(" trigered");
      if (state.currentChat._id === actions.payload.from) {
        state.currentChatMessages.push({
          self: false,
          message: actions.payload.message,
          time: actions.payload.time,
          date: actions.payload.date,
        });
      } else {
        let sender = state.allUsers.find(
          (user) => user._id === actions.payload.from
        );
        toast.info(`${sender.name} : ${actions.payload.message}`, {
          toastId: `${sender.name}`,
        });
      }
    },
    setAllUsers(state, actions) {
      state.allUsers = actions.payload;
    },
    setInputBox(state, actions) {
      state.inputBox = actions.payload;
    },
  },
});

export const actions = chatSlice.actions;

export default chatSlice;
