import React from "react";
import styles from "./Header.module.scss";
import { Logout, video } from "../../../assets/img";
import { ExitScreen } from "../Access/AccessScreens/ExitScreen/ExitScreen";
import { SearchField } from "./Search/SearchField";

export const Header = () => {
  const [isExit, setIsExit] = React.useState(true);

  return (
    <>
      <div className={styles.body}>
        <SearchField />
        <div className={styles.buttonBlock}>
          <a href="https://drive.google.com/file/d/1Tk-nru1anuZX-L99ZJVY0GvE6JPesqv8/view" target="_blank" rel="noreferrer" className={styles.video}>
            <img src={video} alt="" />
            Обучение
          </a>
          <div className={styles.button} onClick={() => setIsExit(false)}>
            <img src={Logout} alt="Кнопка выхода" />
            <p className={styles.buttonText}>Выход</p>
          </div>
        </div>
        {/* <a href="" className={styles.video}><img src={video} alt="" />Обучение</a>
        <div className={styles.button} onClick={()=>setIsExit(false)}>
          <img src={Logout} alt="Кнопка выхода" />
          <p className={styles.buttonText}>Выход</p>
        </div> */}
      </div>
      {isExit ? <></> : <ExitScreen active={isExit} setIsExit={setIsExit} />}
    </>
  );
};
