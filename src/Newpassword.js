import { useFormik } from "formik";
import React, { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import * as yup from "yup";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import swal from "sweetalert";

function Newpassword() {
  const navigate = useNavigate();
  const { email } = useParams();

  const validationSchema = yup.object({
    password: yup.string().required().min(5),
    password2: yup.string().required().min(5),
  });

  const handleSubmit = async (values) => {
    try {
      if (values.password === values.password2) {
        let res = await axios.post(
          `http://localhost:4500/setNewPassword/${email}`,
          {
            password: values.password,
          }
        );
        if (res) {
          //
          swal(
            "Done!",
            "Your password has been changed successfully !",
            "success"
          );
          let { id, token } = res.data;
          localStorage.setItem("loginToken", token);
          navigate(`/chat/${id}`);
        }
      } else {
        toast.error("passwords not match");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const [show, toggleShow] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      password2: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => handleSubmit(values),
  });
  return (
    <div className="form-container">
      <form onSubmit={formik.handleSubmit}>
        <h2>Enter a new password</h2>
        <div className="pass">
          <div>
            <TextField
              error={formik.touched.password ? formik.errors.password : ""}
              helperText={formik.touched.password ? formik.errors.password : ""}
              onBlur={formik.handleBlur}
              type={show ? "text" : "password"}
              name="password"
              onChange={formik.handleChange}
              label="password"
              variant="standard"
            />
            <TextField
              error={formik.touched.password2 ? formik.errors.password2 : ""}
              helperText={
                formik.touched.password2 ? formik.errors.password2 : ""
              }
              onBlur={formik.handleBlur}
              type={show ? "text" : "password"}
              name="password2"
              onChange={formik.handleChange}
              label="Re-enter password"
              variant="standard"
            />
          </div>

          <span onClick={() => toggleShow(!show)}>
            {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </span>
        </div>

        <br />
        <Button type="Submit" variant="contained">
          Set password
        </Button>
      </form>
      <ToastContainer pauseOnHover={false} />
    </div>
  );
}

export default Newpassword;
