import React from "react";
import styles from "./Modal.module.scss";
import { error, success, xmark } from "../../../../../assets/img";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../../../store/usersSlise";

export const UserDel = ({email}) => {
  const dispatch = useDispatch();
  return (
    <div className={styles.body} onClick={() => dispatch(closeModal())}>
      <div className={styles.contentSmall} onClick={(e) => e.stopPropagation()}>
        <div className={styles.containerSmall}>
          <div className={styles.containerMain}>
            <div className={styles.header}>Пользователь удалён</div>
            <div className={styles.textError}>
            Пользователь {email} утратил доступ
            </div>
          </div>
          <button className={styles.containerButtonSmall}>
            <img
              onClick={() => dispatch(closeModal())}
              src={xmark}
              alt=""
            />
          </button>
        </div>
      </div>
    </div>
  );
};
