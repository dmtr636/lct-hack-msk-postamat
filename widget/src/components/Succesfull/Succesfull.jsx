import React from "react";
import styles from "./Succesfull.module.scss";
import { succesfull } from "../../assets";

export const Succesfull = ({ SetStep }) => {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <img src={succesfull} alt="" srcset="" />
        <div className={styles.text}>Спасибо! <br /> Успешно отправлено!</div>
        <button className={styles.button} onClick={()=>SetStep(1)}>Главная</button>
      </div>
    </div>
  );
};
