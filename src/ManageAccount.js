import React, { useState } from "react";
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import "./App.css";

function ManageAccount() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.chat);
  return (
    <>
      <IconButton
        onClick={() => {
          navigate("/chat");
        }}
      >
        <ChevronLeftIcon />
      </IconButton>
      <div className="profile-manager">
        <img src={currentUser.profilePicture} alt="profile-pic" />
        <Button
          onClick={() => {
            navigate("/changeProfile");
          }}
          variant="text"
        >
          Change profile picture
        </Button>
        <h5>
          Name : {currentUser.name}
          <Button
            onClick={() => {
              navigate("/changeUsername");
            }}
            variant="text"
          >
            Change Change Username
          </Button>
        </h5>
        <h5>
          <Button
            onClick={() => {
              navigate("/changePassword");
            }}
            variant="contained"
          >
            change password
          </Button>
        </h5>
      </div>
    </>
  );
}

export default ManageAccount;
