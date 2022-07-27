import { useFormik } from "formik";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import { TextField } from "@mui/material";
import axios from "axios";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const [show, toggleShow] = useState(false);

  const validation = yup.object({
    name: yup.string().required().min(3),
    email: yup.string().email().required(),
    age: yup.number().required().min(15).max(70),
    number: yup
      .number()
      .required()
      .test(
        "len",
        "Number atleast have 10 digits",
        (val) => val && val.toString().length > 9
      ),
    password: yup.string().required().min(5),
  });
  const handleSubmit = async (value) => {
    try {
      await axios.post("http://localhost:4500/register", value);
      navigate(`/validate/${value.email}`);
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.warning("Server error, Please try after sometime", {
          toastId: "netwotk error",
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
      name: "",
      email: "",
      age: "",
      number: "",
      password: "",
    },
    validationSchema: validation,
    onSubmit: (values) => handleSubmit(values),
  });
  return (
    <div className="form-container">
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <h2>Register</h2>
        <div className="username">
          <TextField
            error={formik.touched.name && formik.errors.name ? true : false}
            helperText={formik.touched.name ? formik.errors.name : ""}
            value={formik.values.name}
            onBlur={formik.handleBlur}
            name="name"
            onChange={formik.handleChange}
            label="Name"
            variant="standard"
          />
        </div>
        <br />
        <div>
          <TextField
            error={formik.touched.email && formik.errors.email ? true : false}
            helperText={formik.touched.email ? formik.errors.email : ""}
            value={formik.values.email}
            onBlur={formik.handleBlur}
            name="email"
            onChange={formik.handleChange}
            label="Email"
            variant="standard"
          />
        </div>
        <br />
        <div>
          <TextField
            error={formik.touched.age && formik.errors.age ? true : false}
            helperText={formik.touched.age ? formik.errors.age : ""}
            value={formik.values.age}
            onBlur={formik.handleBlur}
            type="number"
            min="15"
            max="80"
            name="age"
            onChange={formik.handleChange}
            label="Age"
            variant="standard"
          />
        </div>
        <br />
        <div>
          <TextField
            error={formik.touched.number && formik.errors.number ? true : false}
            helperText={formik.touched.number ? formik.errors.number : ""}
            value={formik.values.number}
            onBlur={formik.handleBlur}
            type="number"
            name="number"
            onChange={formik.handleChange}
            label="Number"
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
            value={formik.values.password}
            onBlur={formik.handleBlur}
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
        <Button type="Submit" variant="contained">
          Create account
        </Button>
        <Link to={"/login"}>
          <h5>Already have an account? Login</h5>
        </Link>
      </form>
      <ToastContainer pauseOnFocusLoss={false} />
    </div>
  );
}

export default Register;
