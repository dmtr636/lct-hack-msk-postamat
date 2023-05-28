import React from "react";
import styles from "./AccessHead.module.scss";
import { useSelector } from "react-redux";
import { Plus } from "../../../../assets/img";
import { AddUser } from "../AddUser/AddUser";

export const AcessHead = () => {
  const userRoot = useSelector((state) => state.auth.auth.role);
  const [user, setUser] = React.useState(false);
  const [admin, setadmin] = React.useState(false);
  return (
    <>
      <h1 className={styles.header}>Доступы</h1>
      <div className={styles.head}>
        <button className={styles.button} onClick={() => setUser(true)}>
          <img src={Plus} alt=""/>
          <p className={styles.btnText}>Добавить пользователя</p>
        </button>
        {userRoot === "root" ? (
          <button className={styles.button} onClick={() => setadmin(true)}>
          <img src={Plus} alt=""/>
          <p className={styles.btnText}>Добавить администратора</p>
        </button>
        ) : (
          <></>
        )}
      </div>
      {user ? (
        <AddUser isActive={setUser} role={"user"} roleName={"пользователя"} />
      ) : (
        <></>
      )}
      {admin ? (
        <AddUser
          isActive={setadmin}
          role={"admin"}
          roleName={"администратора"}
        />
      ) : (
        <></>
      )}
    </>
  );
};
