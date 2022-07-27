import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";

function ResetOtp() {
  const { email } = useParams();

  const navigate = useNavigate();

  const validation = yup.object({
    otp: yup.number().required(),
  });

  const handleSubmit = async (otp) => {
    try {
      let res = await axios.post(
        `http://localhost:4500/resetPassword/otp/${email}`,
        otp
      );
      if (res) {
        navigate(`/new_password/${email}`);
      }
    } catch (error) {
      if (error.code == "ERR_NETWORK") {
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

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: validation,
    onSubmit: (values) => handleSubmit(values),
  });
  return (
    <div className="form-container">
      <form onSubmit={formik.handleSubmit}>
        <div>
          <h2>
            OTP sent to <span className="primary">{email}</span>
          </h2>
          <h3>Enter OTP to reset your account password</h3>
        </div>
        <TextField
          className="mb-3"
          error={formik.touched.otp !== undefined ? formik.errors.otp : ""}
          helperText={formik.touched.otp ? formik.errors.otp : ""}
          onBlur={formik.handleBlur}
          name="otp"
          onChange={formik.handleChange}
          label="OTP"
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

export default ResetOtp;
