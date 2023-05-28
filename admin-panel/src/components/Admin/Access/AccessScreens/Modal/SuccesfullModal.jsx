import React from "react";
import styles from "./Modal.module.scss";
import { success, xmark } from "../../../../../assets/img";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../../../store/usersSlise";

export const SuccesfullModal = ({ isActive }) => {
  const dispatch=useDispatch()
  return (
    <div className={styles.body} onClick={() => dispatch(closeModal())}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.container}>
          <div className={styles.containerMain}>
            <div className={styles.img}><img src={success} alt="" /></div>
            <div className={styles.header}>Успешно добавлен!</div>
            <div className={styles.text}>
              Сообщение с паролем было отправлено на указанную почту
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
