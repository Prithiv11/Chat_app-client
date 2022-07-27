import { CircularProgress, IconButton, Drawer } from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import SendIcon from "@mui/icons-material/Send";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Wa.css";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "./Redux CDS/mainSlice";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import { ToastContainer } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

function Wa() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  var time = new Date();

  let month = time.getMonth() + 1;
  var date = [
    time.getDate().toString().padStart(2, 0),
    month.toString().padStart(2, 0),
    time.getFullYear().toString(),
  ].join("/");

  //MM/DD/yy
  var msgDate = [
    month.toString().padStart(2, 0),
    time.getDate().toString().padStart(2, 0),
    time.getFullYear().toString(),
  ].join("/");

  const currentTime = time.toLocaleString("en-US", {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
  });
  const host = "http://localhost:4500";
  // dispatch

  const dispatch = useDispatch();

  const { allUsers, currentChat, currentChatMessages, currentUser, inputBox } =
    useSelector((state) => state.chat);

  let currentChatdata = allUsers.find((user) => user._id == currentChat._id);

  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const socket = useRef(null);
  const scrollRef = useRef();

  //functions
  const getUserData = async () => {
    try {
      let { data } = await axios.get(
        `http://localhost:4500/user/${currentUserId}`,
        {
          headers: {
            "x-auth-token": localStorage.getItem("loginToken"),
          },
        }
      );
      dispatch(actions.setCurrentUser(data));
    } catch (error) {
      console.log(error);
    }
  };

  const getUsersList = async () => {
    if (currentUser._id) {
      let users = await axios.post(`http://localhost:4500/getAllUsers`, {
        id: currentUser._id,
      });
      dispatch(actions.setAllUsers(users.data));
    }
  };

  // send message

  const handleSendMsg = (msg) => {
    if (msg !== "") {
      socket.current.emit("send-msg", {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
        time: currentTime,
        date: msgDate,
      });
      getCurrentChatMessages({ from: currentUser._id, to: currentChat._id });
      // let texts = [...currentChatMessages];
      // let indexOfTodayGroup = texts.findIndex((group) => group._id === msgDate);
      // if (indexOfTodayGroup > 0) {
      //   console.log(indexOfTodayGroup);
      //   texts[indexOfTodayGroup].messages.push({
      //     message: msg,
      //     sender: currentUser._id,
      //     time: currentTime,
      //   });
      // } else {
      //   texts.push({
      //     _id: msgDate,
      //     messages: [
      //       {
      //         message: msg,
      //         sender: currentUser._id,
      //         time: currentTime,
      //       },
      //     ],
      //   });
      // }
      // texts.push({
      //   sender: currentUser._id,
      //   message: msg,
      //   date: msgDate,
      //   time: currentTime,
      // });
      // dispatch(actions.setCurrentChatMessages(texts));
      dispatch(actions.setInputBox(""));
    }
  };
  const getCurrentChatMessages = async ({ from, to }) => {
    let { data } = await axios.post(`http://localhost:4500/getmessagesbydate`, {
      from: from,
      to: to,
    });
    dispatch(actions.setCurrentChatMessages(data));
  };
  //

  useEffect(() => {
    if (localStorage.getItem("loginToken")) {
      getUserData();
      socket.current = io(host);
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current.emit("join-user", currentUser._id);
      getUsersList();
    } else {
      return;
    }
  }, [currentUser, currentChat]);

  useEffect(() => {
    if (currentUser) {
      getUsersList();
    } else {
      return;
    }
  }, [currentUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatMessages]);

  //
  useEffect(() => {
    if (currentChat._id) {
      socket.current.on("msg-recieve", (data) => {
        console.log("triggered from wa");
        // dispatch(actions.updateCurrentChatMessages(data));
        getCurrentChatMessages({ from: currentUser._id, to: currentChat._id });
        // getUsersList();
      });

      socket.current.on("refresh", (id) => {
        if (id !== currentUser._id) {
          getUsersList();
        }
      });
    }
  }, [currentChat._id, socket.current]);

  return (
    <div className="main-container">
      {currentUser.name ? (
        <>
          <div className="chatlist-container">
            <div className="header">
              <div className="start">
                <img
                  src={currentUser.profilePicture}
                  alt={`${currentUser.name}'s profile`}
                />
                <h3>{currentUser.name}</h3>
              </div>
              <div className="end">
                <IconButton
                  onClick={() => {
                    navigate(`/manageAccount`);
                  }}
                >
                  <ManageAccountsIcon />
                </IconButton>
              </div>
            </div>
            <div className="body">
              {allUsers.map((contact, index) => {
                return (
                  <div
                    key={index}
                    className="chat-list-card"
                    onClick={async () => {
                      dispatch(actions.changeChat(contact));

                      // let messages = await axios.post(
                      //   `http://localhost:4500/getmessages`,
                      //   {
                      //     from: currentUser._id,
                      //     to: contact._id,
                      //   }
                      // );
                      getCurrentChatMessages({
                        from: currentUser._id,
                        to: contact._id,
                      });
                    }}
                  >
                    <img
                      src={contact.profilePicture}
                      alt={`${contact.name}'s profile`}
                    />
                    <h5>{contact.name}</h5>
                    <span style={{ fontSize: ".5vw", marginLeft: "auto" }}>
                      {contact.online ? "🟢" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="chatpage-container">
            <div className="chat-page-header">
              <div className="drawer-main">
                <IconButton onClick={() => setIsDrawerOpen(true)}>
                  <PeopleAltRoundedIcon />
                </IconButton>
                <Drawer
                  anchor="left"
                  open={isDrawerOpen}
                  onClose={() => setIsDrawerOpen(false)}
                >
                  <div className="drawer-box">
                    <div></div>
                    <div className="chatlist-container-inDrawer">
                      <div className="header">
                        <div className="start">
                          <IconButton onClick={() => setIsDrawerOpen(false)}>
                            <CloseIcon />
                          </IconButton>
                          <h3>{currentUser.name}</h3>
                          <img
                            src={currentUser.profilePicture}
                            alt={`${currentUser.name}'s profile`}
                          />
                        </div>
                        <div className="end">
                          <IconButton
                            onClick={() => {
                              navigate(`/manageAccount/${currentUser._id}`);
                            }}
                          >
                            <ManageAccountsIcon />
                          </IconButton>
                        </div>
                      </div>
                      <div className="body">
                        {allUsers.map((contact, index) => {
                          return (
                            <div
                              key={index}
                              className="chat-list-card"
                              onClick={async () => {
                                dispatch(actions.changeChat(contact));

                                setIsDrawerOpen(false);
                                // let messages = await axios.post(
                                //   `http://localhost:4500/getmessagesbydate`,
                                //   {
                                //     from: currentUser._id,
                                //     to: contact._id,
                                //   }
                                // );
                                // dispatch(
                                //   actions.setCurrentChatMessages(messages.data)
                                // );
                                getCurrentChatMessages({
                                  from: currentUser._id,
                                  to: contact._id,
                                });
                              }}
                            >
                              <img
                                src={contact.profilePicture}
                                alt={`${contact.name}'s profile`}
                              />
                              <h5>{contact.name}</h5>
                              <span
                                style={{
                                  fontSize: "1.5vw",
                                  marginLeft: "auto",
                                }}
                              >
                                {contact.online ? "🟢" : ""}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Drawer>
              </div>
              {currentChat._id ? (
                <>
                  <img
                    src={currentChat.profilePicture}
                    alt={`${currentChat.name}'s profile`}
                  />
                  <div className="name_lastseen">
                    <h4>{currentChat.name}</h4>
                    <span>
                      {currentChatdata
                        ? currentChatdata.online
                          ? "Online"
                          : currentChatdata.lastSeenDate === date
                          ? `lastseen ${currentChatdata.lastSeen}`
                          : `lastseen ${currentChatdata.lastSeenDate}`
                        : ""}
                    </span>
                  </div>
                </>
              ) : (
                ""
              )}

              <div className="end">
                <IconButton
                  onClick={() => {
                    localStorage.removeItem("loginToken");
                    dispatch(actions.changeChat(""));
                    navigate("/login");
                    socket.current.emit("log-off", { currentUser, date });
                  }}
                  aria-label="add an alarm"
                >
                  <PowerSettingsNewIcon />
                </IconButton>
              </div>
            </div>
            {currentChat._id ? (
              <>
                <div className="message-container">
                  {currentChatMessages ? (
                    currentChatMessages.map((messageGroup, index) => {
                      return (
                        <Fragment key={index}>
                          <div className="groupDate">
                            <h5>
                              {messageGroup._id === msgDate
                                ? "Today"
                                : messageGroup._id}
                            </h5>
                          </div>
                          {messageGroup.messages.map((message) => {
                            return (
                              <div
                                ref={scrollRef}
                                key={uuidv4()}
                                className={
                                  message.sender == currentUser._id
                                    ? "myself-text-bubble"
                                    : ""
                                }
                              >
                                <div>
                                  {message.message}
                                  <span>{message.time}</span>
                                </div>
                              </div>
                            );
                          })}
                        </Fragment>
                      );
                    })
                  ) : (
                    <div>
                      <CircularProgress />
                    </div>
                  )}
                </div>
                <div className="input-container">
                  <input
                    onKeyDownCapture={(e) => {
                      if (e.keyCode === 13) {
                        // console.log("13");
                        handleSendMsg(inputBox);
                      }
                    }}
                    onChange={(e) => {
                      dispatch(actions.setInputBox(e.target.value));
                    }}
                    type="text"
                    placeholder="Enter your text here"
                    value={inputBox}
                  />
                  <div className="send-button">
                    <IconButton
                      onClick={() => {
                        handleSendMsg(inputBox);
                      }}
                      color="primary"
                      aria-label="add to shopping cart"
                    >
                      <SendIcon />
                    </IconButton>
                  </div>
                </div>
              </>
            ) : (
              <div className="initial-chat-message">
                <h2>Hey, {currentUser.name} !</h2>
                <p className="mobile">
                  click the topleft icon to show chatlist{" "}
                </p>
                <p>Select a user in the chatlist to start chatting</p>
              </div>
            )}
            <ToastContainer pauseOnFocusLoss={false} />
          </div>
        </>
      ) : (
        <div>
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default Wa;
