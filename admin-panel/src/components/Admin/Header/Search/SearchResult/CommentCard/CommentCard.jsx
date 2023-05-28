import React from "react";
import styles from "./CommentCard.module.scss";
import classNames from "classnames";
import {useNavigate} from "react-router-dom";

export const CommentCard = ({ rating, types, address, id, date }) => {
  const navigate = useNavigate()

  return (
    <div className={styles.body} onClick={() => navigate(`/reviews/${id}`)}>
      <div className={classNames (styles.rating,{[styles.ratingBad]: rating < 3,
                  [styles.ratingNormal]: rating ===3,
                  [styles.ratingGood]: rating >3,})}>{rating}</div>
      <div className={styles.content}>
        <div className={styles.categories}>
          {types.map((i) => (
            <span className={styles.type}>{i}</span>
          ))}
        </div>

        <div className={styles.adress}>{address}</div>
      </div>
      <div className={styles.number}>
        <div className={styles.id}>№{id}</div>
        <div className={styles.date}>{date.substr(0, 5)}</div>
      </div>
    </div>
  );
};
