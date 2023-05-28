import React from "react";
import styles from "./ExitScreen.module.scss";
import { MyButton } from "../../../../common/Button/MyButton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../../../../store/authSlise";
import axios from "axios";
import { domain } from "../../../../../constants/config";

export const ExitScreen = ({active, setIsExit}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logOutButton = () => {
    axios
      .post(`${domain}/api/admin/logout`)
      .then((response) => {
        dispatch(
          setAuth({
            id: null,
            email: "",
            name: "",
            role: "",
            isAuthenticated: false,
          })
        );
        console.log(response.data);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
      setIsExit(false)
  };
  return (
    <div className={styles.body} onClick={()=>setIsExit(true)}>
      <div className={styles.content} onClick={e=>e.stopPropagation()}>
        <div className={styles.container}>
          <h2 className={styles.header}>Вы точно хотите выйти?</h2>
          <div className={styles.text}>
            Для повторной авторизации нужно ввести данные заново
          </div>
          <div className={styles.buttons}>
            <MyButton onClick={()=>setIsExit(true)} redButton>Отмена</MyButton>
            <MyButton whiteButton onClick={logOutButton}>
              Выйти
            </MyButton>
          </div>
        </div>
      </div>
    </div>
  );
};
