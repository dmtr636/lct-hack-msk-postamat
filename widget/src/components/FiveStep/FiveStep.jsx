import React from "react";
import styles from "./FiveStep.module.scss";

import { ReactComponent as IconOne } from "../../assets/1.svg";
import { ReactComponent as IconTwo } from "../../assets/2.svg";
import { ReactComponent as IconThree } from "../../assets/3.svg";
import { ReactComponent as IconFour } from "../../assets/4.svg";
import { ReactComponent as IconFive } from "../../assets/5.svg";
import { ReactComponent as IconSix } from "../../assets/6.svg";
import { ReactComponent as IconSeven } from "../../assets/7.svg";
import { ReactComponent as IconEight } from "../../assets/8.svg";
import { ReactComponent as IconNine } from "../../assets/9.svg";
import { ReactComponent as IconTen } from "../../assets/10.svg";

import { smileSS } from "../../assets";

export const FiveStep = ({ SetName, setTel, SetStep, name, tel }) => {
  const [click, setClick] = React.useState(false);

  
  const [oneIsActive, setOneIsActive] = React.useState(false);
  const [twoIsActive, setTwoIsActive] = React.useState(false);
  const [threeIsActive, setThreeIsActive] = React.useState(false);
  const [fourIsActive, setFourIsActive] = React.useState(false);
  const [fiveIsActive, setFiveIsActive] = React.useState(false);

  const onClickOne = () => {
    setOneIsActive(true);
   
    setTwoIsActive(false);
    setThreeIsActive(false);
    setFourIsActive(false);
    setFiveIsActive(false);
    setClick(true);
  };
  const onClickTwo = () => {
    setOneIsActive(false);
  
    setTwoIsActive(true);
    setThreeIsActive(false);
    setFourIsActive(false);
    setFiveIsActive(false);
    setClick(true);
  };
  const onClickThree = () => {
    setOneIsActive(false);
   
    setTwoIsActive(false);
    setThreeIsActive(true);
    setFourIsActive(false);
    setFiveIsActive(false);
    setClick(true);
  };
  const onClickFour = () => {
    setOneIsActive(false);
 
    setTwoIsActive(false);
    setThreeIsActive(false);
    setFourIsActive(true);
    setFiveIsActive(false);
    setClick(true);
  };
  const onClickFive = () => {
    setOneIsActive(false);
   
    setTwoIsActive(false);
    setThreeIsActive(false);
    setFourIsActive(false);
    setFiveIsActive(true);
    setClick(true);
  };

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        Оцените доступность и работу постамата
        <img src={smileSS} className={styles.smile} alt="" />
      </div>
      <div className={styles.iconsArray}>
        {oneIsActive ? (
          <IconSix />
        ) : (
          <IconOne className={styles.icon} onClick={() => onClickOne()} />
        )}
        {twoIsActive ? (
          <IconSeven />
        ) : (
          <IconTwo className={styles.icon} onClick={() => onClickTwo()} />
        )}
        {threeIsActive ? (
          <IconEight />
        ) : (
          <IconThree className={styles.icon} onClick={() => onClickThree()} />
        )}
        {fourIsActive ? (
          <IconNine />
        ) : (
          <IconFour className={styles.icon} onClick={() => onClickFour()} />
        )}
        {fiveIsActive ? (
          <IconTen />
        ) : (
          <IconFive className={styles.icon} onClick={() => onClickFive()} />
        )}
      </div>
      <div>
        <button
          disabled={!click}
          className={styles.button}
          onClick={() => SetStep(5)}
        >
          Далее
        </button>
      </div>
    </div>
  );
};
