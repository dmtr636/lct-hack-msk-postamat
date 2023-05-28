import React from "react";
import styles from "./UserCard.module.scss";
import { ReactComponent as Delete } from "../../../../assets/img/Delete.svg";
import classNames from "classnames";
import { DeleteScreen } from "../AccessScreens/DeleteScreen/DeleteScreen";
import { useSelector } from "react-redux";

export const UserCard = ({ name, email, id,role,canDel }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isDel, setIsDel] = React.useState(true);
  const isRoot=useSelector((state)=>state.auth.auth.role)
 
  const handleHover = () => {
    setIsHovered(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
  };
  return (
    <>
      <div className={styles.body}>
        <div className={styles.info}>
          <div className={styles.block}>
            <div className={styles.name}>Имя</div>
            <div className={styles.subname}>{name}</div>
          </div>
          <div className={styles.block}>
            <div className={styles.name}>Почта</div>
            <div className={styles.subname}>{email}</div>
          </div>
        </div>
        {canDel?<div
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
          onClick={() => setIsDel(false)}
          className={styles.button}
        >
          <Delete
            className={classNames({
              [styles.delBtn]: !isHovered,
              [styles.delBtnHover]: isHovered,
            })}
          />
        </div>:<></>}
      </div>
      {isDel?<></>:<DeleteScreen active={isDel} setIsDel={setIsDel} id={id} email={email} role={role}/>}
    </>
  );
};
