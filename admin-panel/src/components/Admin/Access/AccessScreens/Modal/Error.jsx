import React from "react";
import styles from "./Modal.module.scss";
import { error, success, xmark } from "../../../../../assets/img";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../../../store/usersSlise";

export const ErrorModal = ({ isActive }) => {
  const dispatch=useDispatch()
  return (
    <div className={styles.body} onClick={() => dispatch(closeModal())}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.container}>
          <div className={styles.containerMain}>
            <div className={styles.img}><img src={error} alt="" /></div>
            <div className={styles.header}>Произошла ошибка</div>
            <div className={styles.textError}>
            Возникли технические трудности при добавлении
пользователя. Попробуйте повторить позже.
            </div>
          </div>
          <button className={styles.containerButton}>
            <img onClick={() => dispatch(closeModal())} src={xmark} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};
