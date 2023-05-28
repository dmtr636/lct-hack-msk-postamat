import React from "react";
import styles from "./MainPage.module.scss";
import { QRcode, logo } from "../../assets";
import { Form } from "../../components/Form/Form";
export const MainPage = () => {
  return (
    <div className={styles.body}>
      <div className={styles.infoBlock}>
        <img src={logo} alt="" />
        <div className={styles.text}>
          Ваша обратная связь <br /> делает нас лучше!
        </div>
        <div className={styles.qrcode}>
            <img src={QRcode} alt="" />
            <div className={styles.qrText}>www.mos.ru</div>
        </div>
      </div>
      <div className={styles.formBlock}>
        <Form/>
      </div>
    </div>
  );
};
