import React from 'react'
import styles from "./LoadDataModal.module.scss"
export const LoadDataModal = () => {
    
  return (
    <div className={styles.body}>
      <div className={styles.content}>
        <div className={styles.header}>Загружается и обрабатывается...</div>
        <div className={styles.text}>Пожалуйста, подождите. Может занять несколько минут</div>
      </div>
    </div>
  )
}
