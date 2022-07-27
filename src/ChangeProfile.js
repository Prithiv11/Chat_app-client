import React, { useState } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function ChangeProfile() {
  const { currentUser } = useSelector((state) => state.chat);
  const navigate = useNavigate();

  const uploadTodb = async (string) => {
    try {
      let res = await axios.post(
        `http://localhost:4500/uploadProfilePicture/${currentUser.email}`,
        { imageURL: string }
      );
      let { id, token } = res.data;
      localStorage.setItem("loginToken", token);
      navigate(`/chat`);
    } catch (error) {
      console.log(error);
    }
  };
  const [file, updatefile] = useState(null);
  const imageUpload = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "my-chat-app-profyl-upload");
    try {
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/prithiviraj-mern/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const urldata = await res.json();
      uploadTodb(urldata.url);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="profilePictureUpload-container">
      {file ? (
        <>
          <img
            height="100vw"
            width="100vw"
            style={{ borderRadius: "50%", objectFit: "cover" }}
            src={URL.createObjectURL(file)}
          />
          <span>{file.name}</span>
          <div>
            <Button
              onClick={() => {
                imageUpload(file);
              }}
              variant="contained"
            >
              Upload
            </Button>
            {/* &nbsp; */}
          </div>
        </>
      ) : (
        <>
          <h1>Select a picture </h1>
          <input
            type="file"
            onChange={(e) => updatefile(e.target.files[0])}
            placeholder="upload your profile Picture"
          />
        </>
      )}
    </div>
  );
}

export default ChangeProfile;
