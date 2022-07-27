import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";

function ResetPassword() {
  const navigate = useNavigate();
  const handleSubmit = async (data) => {
    try {
      let res = await axios.post(`http://localhost:4500/resetPassword`, data);
      if (res) {
        navigate(`/${data.email}/reset_password`);
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.warning("Internal server error", {
          toastId: "server error",
        });
      } else {
        toast.error(error.response.data.message, {
          toastId: "error",
        });
      }
    }
  };

  const validation = yup.object({
    email: yup.string().email().required(),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validation,
    onSubmit: (values) => handleSubmit(values),
  });

  return (
    <div className="form-container">
      <form onSubmit={formik.handleSubmit}>
        <div>
          <h3>Enter your E-mail</h3>
        </div>
        <TextField
          className="mb-3"
          error={formik.touched.email !== undefined ? formik.errors.email : ""}
          helperText={formik.touched.email ? formik.errors.email : ""}
          onBlur={formik.handleBlur}
          name="email"
          onChange={formik.handleChange}
          label="Email"
          variant="standard"
        />
        <Button type="Submit" variant="contained">
          Submit
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default ResetPassword;
