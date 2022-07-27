import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import ChangePassword from "./ChangePassword";
import ChangeProfile from "./ChangeProfile";
import ChangeUsername from "./ChangeUsername";
import Wa from "./component/Wa";
import Login from "./Login";
import ManageAccount from "./ManageAccount";
import Newpassword from "./Newpassword";
import Otp from "./Otp";
import ProfilePic from "./ProfilePic";
import Register from "./Register";
import ResetOtp from "./ResetOtp";
import ResetPassword from "./ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <div className="mainDiv">
        <Routes>
          <Route path="/chat" element={<Wa />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/:email/reset_password" element={<ResetOtp />} />
          <Route path="/new_password/:email" element={<Newpassword />} />
          <Route path="/manageAccount" element={<ManageAccount />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/changeProfile" element={<ChangeProfile />} />
          <Route path="/changeUsername" element={<ChangeUsername />} />
          <Route path="/validate/:email" element={<Otp />} />
          <Route path="/uploadProfilePicture/:email" element={<ProfilePic />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
