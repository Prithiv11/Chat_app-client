import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import "./ChangePassword.css";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

function ChangePassword() {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const handleSubmit = async (data) => {
    let body = { oldPassword: data.password, newPassword: data.newPassword };
    try {
      let result = await axios.post(
        `http://localhost:4500/changePassword/${currentUserId}`,
        body
      );
      if (result) {
        swal("success", result.data.message, "success");
        // toast.success(result.data.message, {
        //   toastId: "auth error",
        // });
        navigate("/chat");
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        toastId: "auth error",
      });
    }
  };
  const validate = yup.object({
    password: yup.string().required().min(5),
    newPassword: yup.string().required().min(5),
    reEnter: yup.string().required().min(5),
  });
  const formik = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      reEnter: "",
    },
    validationSchema: validate,
    onSubmit: (values) => {
      console.log(values);
      if (values.newPassword === values.reEnter) {
        handleSubmit(values);
        formik.resetForm();
      } else {
        toast.error("Passwords not match", {
          toastId: "password_mismatch",
        });
      }
    },
  });
  return (
    <div className="change-password-container">
      <form onSubmit={formik.handleSubmit}>
        <TextField
          error={
            formik.touched.password && formik.errors.password ? true : false
          }
          helperText={formik.touched.password ? formik.errors.password : ""}
          onBlur={formik.handleBlur}
          type="password"
          name="password"
          onChange={formik.handleChange}
          label="Current password"
          variant="standard"
          value={formik.values.password}
        />

        <TextField
          error={
            formik.touched.newPassword && formik.errors.newPassword
              ? true
              : false
          }
          helperText={
            formik.touched.newPassword ? formik.errors.newPassword : ""
          }
          onBlur={formik.handleBlur}
          type="password"
          name="newPassword"
          onChange={formik.handleChange}
          label="New password"
          variant="standard"
          value={formik.values.newPassword}
        />

        <TextField
          error={formik.touched.reEnter && formik.errors.reEnter ? true : false}
          helperText={formik.touched.reEnter ? formik.errors.reEnter : ""}
          onBlur={formik.handleBlur}
          type="password"
          name="reEnter"
          onChange={formik.handleChange}
          label="Re-enter New password"
          variant="standard"
          value={formik.values.reEnter}
        />
        <br />
        <Button className="mb-4" type="Submit" variant="contained">
          Submit
        </Button>
      </form>
      <ToastContainer pauseOnFocusLoss={false} />
    </div>
  );
}

export default ChangePassword;
