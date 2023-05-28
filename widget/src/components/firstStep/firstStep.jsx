import React from "react";
import styles from "./firstStep.module.scss";
import { smileFS } from "../../assets";
import ReactInputMask from "react-input-mask";

export const FirstStep = ({ SetName, SetStep, setTel, name, tel }) => {
  const phoneRegex = new RegExp(
    "\\+7 \\([0-9]{3}\\) [0-9]{3}-[0-9]{2}-[0-9]{2}"
  );
  let isValid
  if(name){
    isValid = name.length && phoneRegex.test(tel);
  }
  

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        Представьтесь,{" "}
        <p className={styles.text}>
          пожалуйста <img src={smileFS} className={styles.smile} alt="" />
        </p>{" "}
      </div>
      <div>
        <form className={styles.formContainer}>
          <input
            className={styles.inputName}
            type="text"
            placeholder="Ваше имя"
            onChange={(e) => SetName(e.target.value)}
          />
          <ReactInputMask
            className={styles.inputPhone}
            mask="+7 (999) 999-99-99"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            placeholder="Номер телефона"
          />
          <button
            disabled={!isValid}
            type="submit"
            className={styles.button}
            onClick={() => SetStep(2)}
          >
            Перейти к оценке
          </button>
        </form>
      </div>
    </div>
  );
};
