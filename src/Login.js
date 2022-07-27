import { useFormik } from "formik";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";

function Login() {
  var [counter, setCounter] = useState(0);
  const navigate = useNavigate();
  const [show, toggleShow] = useState(false);

  const validation = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required().min(5),
  });

  const handleSubmit = async (value) => {
    try {
      let res = await axios.post("http://localhost:4500/login", value);
      let { id, token } = res.data;
      localStorage.setItem("loginToken", token);
      localStorage.setItem("userId", id);
      navigate(`/chat`);
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.warning("Server error, Please try after sometime", {
          toastId: "netwotk error",
        });
      } else if (error.response.status === 409) {
        navigate(`/validate/${value.email}`);
      } else if (error.response.status === 410) {
        navigate(`/uploadProfilePicture/${value.email}`);
      } else {
        toast.error(error.response.data.message, {
          toastId: "auth error",
        });
        setCounter(counter + 1);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validation,
    onSubmit: (values) => handleSubmit(values),
  });
  return (
    <div className="form-container">
      <form onSubmit={formik.handleSubmit}>
        <h2>Login</h2>
        <div className="username">
          <TextField
            onChange={formik.handleChange}
            error={formik.touched.email && formik.errors.email ? true : false}
            helperText={formik.touched.email ? formik.errors.email : ""}
            value={formik.values.email}
            onBlur={formik.handleBlur}
            id="email"
            name="email"
            label="Email"
            variant="standard"
          />
        </div>
        <br />

        <div className="pass">
          <TextField
            error={
              formik.touched.password && formik.errors.password ? true : false
            }
            helperText={formik.touched.password ? formik.errors.password : ""}
            onBlur={formik.handleBlur}
            id="password"
            type={show ? "text" : "password"}
            name="password"
            onChange={formik.handleChange}
            label="password"
            variant="standard"
          />
          <span onClick={() => toggleShow(!show)}>
            {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </span>
        </div>
        <br />
        <Button className="mb-4" type="Submit" variant="contained">
          Login
        </Button>
        {counter > 2 ? (
          <Link to={`/reset_password`}>
            <h5>Forgot your password?</h5>
          </Link>
        ) : (
          ""
        )}
        <Link to={"/register"}>
          <h5>Dont have an account? Register</h5>
        </Link>
      </form>
      <ToastContainer pauseOnFocusLoss={false} />
    </div>
  );
}

export default Login;
