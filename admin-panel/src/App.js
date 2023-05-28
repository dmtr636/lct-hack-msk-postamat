import React, { useEffect} from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { AdminPage } from "./pages/AdminPage/AdminPage";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuth } from "./store/authSlise";
import { domain } from "./constants/config";
/* import AuthRedirect from "./hoc/AuthRedirect"; */

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .post(`${domain}/api/admin/auth`)
      .then((response) => {
        dispatch(setAuth(response.data));
        /* navigate("/*"); */
      })
      .catch((error) => {
        navigate("/login");
      });
  }, []);
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
