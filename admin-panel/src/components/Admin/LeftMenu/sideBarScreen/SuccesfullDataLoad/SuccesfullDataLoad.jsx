import React from "react";
import styles from "./succesfullDataLoad.module.scss";
import { xmark } from "../../../../../assets/img";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../../../store/usersSlise";

export const SuccesfullDataLoad = ({ SetSuccesLoading }) => {
  const dispatch =useDispatch()
  return (
    <div className={styles.body}>
      <div className={styles.content}>
        <div>
          <div className={styles.header}>Дата-сет загружен</div>
          <div className={styles.text}>Хорошего настроения, эксперт!</div>
        </div>
        <div>
          <button onClick={() => dispatch(closeModal())} className={styles.button}>
            <img src={xmark} alt="" srcset="" />
          </button>
        </div>
      </div>
    </div>
  );
};
