import React from "react";
import styles from "./SecondStep.module.scss";

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
import axios from "axios";

export const SecondStep = ({ SetName, setTel, SetStep, name, tel }) => {
  const [comment, setComment] = React.useState();

  const [rating, setRating] = React.useState(null);
  const [oneIsActive, setOneIsActive] = React.useState(false);
  const [twoIsActive, setTwoIsActive] = React.useState(false);
  const [threeIsActive, setThreeIsActive] = React.useState(false);
  const [fourIsActive, setFourIsActive] = React.useState(false);
  const [fiveIsActive, setFiveIsActive] = React.useState(false);
  const data = {
    comment: comment,
    rating: rating,
    postamat_id: "П-5000",
    user_name: name,
    user_phone: tel,
  };
  const onClickOne = () => {
    setOneIsActive(true);
    setRating(1);
    setTwoIsActive(false);
    setThreeIsActive(false);
    setFourIsActive(false);
    setFiveIsActive(false);
  };
  const onClickTwo = () => {
    setOneIsActive(false);
    setRating(2);
    setTwoIsActive(true);
    setThreeIsActive(false);
    setFourIsActive(false);
    setFiveIsActive(false);
  };
  const onClickThree = () => {
    setOneIsActive(false);
    setRating(3);
    setTwoIsActive(false);
    setThreeIsActive(true);
    setFourIsActive(false);
    setFiveIsActive(false);
  };
  const onClickFour = () => {
    setOneIsActive(false);
    setRating(4);
    setTwoIsActive(false);
    setThreeIsActive(false);
    setFourIsActive(true);
    setFiveIsActive(false);
  };
  const onClickFive = () => {
    setOneIsActive(false);
    setRating(5);
    setTwoIsActive(false);
    setThreeIsActive(false);
    setFourIsActive(false);
    setFiveIsActive(true);
  };
  const fetchData = () => {
    axios
      .post("https://msk-postamat.online/api/reviews", data)
      .then(SetStep(3), SetName(""), setTel(""))
      .catch((e) => console.log(e.error));
  };
  return (
    <div className={styles.body}>
      <div className={styles.header}>
        Поделитесь мнением
        <p className={styles.text}>
          с нами <img src={smileSS} className={styles.smile} alt="" />
        </p>{" "}
      </div>
      <div className={styles.iconsArray}>
        {oneIsActive ? (
          <IconSix  />
        ) : (
          <IconOne className={styles.icon} onClick={() => onClickOne()} />
        )}
        {twoIsActive ? (
          <IconSeven  />
        ) : (
          <IconTwo className={styles.icon} onClick={() => onClickTwo()} />
        )}
        {threeIsActive ? (
          <IconEight />
        ) : (
          <IconThree className={styles.icon} onClick={() => onClickThree()} />
        )}
        {fourIsActive ? (
          <IconNine  />
        ) : (
          <IconFour className={styles.icon} onClick={() => onClickFour()} />
        )}
        {fiveIsActive ? (
          <IconTen  />
        ) : (
          <IconFive className={styles.icon} onClick={() => onClickFive()} />
        )}
      </div>
       <div className={styles.textSub}>Как всё прошло?</div>   
      <div>
        <form
          className={styles.formContainer}
          onSubmit={(e) => e.preventDefault()}
        >
          <textarea
            className={styles.textarea}
            name=""
            id=""
            cols="30"
            rows="10"
            onChange={(e) => setComment(e.target.value)}
            placeholder="Если были трудности, расскажите нам."
          ></textarea>

          <button
            disabled={!(comment && rating)}
            className={styles.button}
            onClick={() => fetchData()}
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};
