import React from "react";
import styles from "./LoginPage.module.scss";
import { Login } from "../../components/Login/Login";
import { useSelector } from "react-redux";
import { redirect } from "react-router-dom";

export const LoginPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  React.useEffect(() => {
    if (isAuthenticated) {
      redirect("/")
    }
  },[isAuthenticated]);
  return (
    <div className={styles.body}>
      <div className={styles.content}>
        <div className={styles.login}>
          <Login />
        </div>
      </div>
    </div>
  );
};
