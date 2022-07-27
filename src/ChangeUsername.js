import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";

function ChangeUsername() {
  const { currentUser } = useSelector((state) => state.chat);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const validator = yup.object({
    name: yup.string().required(),
  });
  const formik = useFormik({
    initialValues: {
      name: currentUser.name,
    },
    validationSchema: validator,
    onSubmit: async (values) => {
      try {
        let result = axios.post(
          `http://localhost:4500/changeUsername/${currentUserId}`,
          values
        );
        if (result) {
          navigate("/chat");
        }
      } catch (error) {
        alert(error);
      }
    },
  });
  return (
    <div className="form-container">
      <form onSubmit={formik.handleSubmit}>
        <h2>Update userName</h2>
        <TextField
          onChange={formik.handleChange}
          error={formik.touched.name && formik.errors.name ? true : false}
          helperText={formik.touched.name ? formik.errors.name : ""}
          value={formik.values.name}
          onBlur={formik.handleBlur}
          id="name"
          name="name"
          label="Enter your name"
          variant="standard"
        />
        <br />
        <Button className="mb-4" type="Submit" variant="contained">
          Update
        </Button>
      </form>
    </div>
  );
}

export default ChangeUsername;
