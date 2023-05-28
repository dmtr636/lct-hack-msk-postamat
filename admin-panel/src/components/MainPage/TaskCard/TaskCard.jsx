import React from "react";
import styles from "./TaskCard.module.scss";
import {useNavigate} from "react-router-dom";

export const TaskCard = ({ type, address, date, id }) => {
  const navigate = useNavigate()
  return (
    <div className={styles.body} onClick={() => navigate(`/tasks/${id}`)}>
      <div className={styles.content}>
        <div className={styles.text}>
          <div className={styles.typeProblem}>{type}</div>
          <div className={styles.address}>{address}</div>
        </div>
        <div className={styles.date}>{date}</div>
      </div>
    </div>
  );
};
