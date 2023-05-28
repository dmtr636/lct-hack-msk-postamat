import React from "react";
import styles from "./login.module.scss";
import { logoRed } from "../../assets/img";
import { Input } from "../common/Input/Input";
import { MyButton } from "../common/Button/MyButton";
import axios from "axios";
import { domain } from "../../constants/config";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../store/authSlise";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  let navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [login, setLogin] = React.useState("");
  const [isError, setIsError] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const data = {
    email: login,
    password: password,
  };
  const sendLogpass = () => {
    console.log(data);
    axios
      .post(`${domain}/api/admin/login`, data)
      .then((response) => {
        dispatch(setAuth(response.data));
        navigate("/");
        setIsError(false)
      })
      .catch((error) => {
        console.error(error);
        setIsError(true);
      });
  };
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, []);
  return (
    <div className={styles.body}>
      <div className={styles.content}>
        <img src={logoRed} alt="" />
        <form action="" onSubmit={(e) => e.preventDefault()}>
          <div className={styles.login}>
            <div className={styles.inputText}>Почта</div>
            <Input
              type="text"
              isError={isError}
              placeholder="Введите почту"
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div className={styles.password}>
            <div className={styles.inputText}>Пароль</div>
            <Input
              type="password"
              isError={isError}
              placeholder={"Введите пароль"}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.buttonContainer}>
            <div className={styles.button}>
              <MyButton
                /* type={"submit"} */
                redButton
                onClick={() => sendLogpass()}
                disabled={!(login && password)}
              >
                Войти
              </MyButton>
            </div>
            {isError ? (
              <div className={styles.pasText}>
                Неправильная почта <br /> или пароль
              </div>
            ) : (
              <></>
            )}
          </div>
        </form>
        {/* <div className={styles.login}>
          <div className={styles.inputText}>Почта</div>
          <Input
            type="text"
            isError={isError}
            placeholder="Введите почту"
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        <div className={styles.password}>
          <div className={styles.inputText}>Пароль</div>
          <Input
            type="password"
            isError={isError}
            placeholder={"Введите пароль"}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.button}>
            <MyButton
              redButton
              onClick={() => sendLogpass()}
              disabled={!(login && password)}
            >
              Войти
            </MyButton>
          </div>

          {isError?<div className={styles.pasText}>Неправильная почта <br /> или пароль</div>:<></>}
        </div> */}
      </div>
    </div>
  );
};
