import React from 'react'
import styles from "./TaskCard.module.scss"
import {useNavigate} from "react-router-dom";
export const SearchTaskCard = ({category,address,id,date}) => {
  const navigate = useNavigate()

  return (
    <div className={styles.body} onClick={() => navigate(`/tasks/T-${id}`)}>

    <div className={styles.content}>
      <div className={styles.categories}>{category}
      </div>

      <div className={styles.address}>{address}</div>
    </div>
    <div className={styles.number}>
      <div className={styles.id}>T-{id}</div>
      <div className={styles.date}>{date.substr(0, 5)}</div>
    </div>
  </div>
  )
}
