import React from "react";
import styles from "./Divider.module.scss";
export const Divider = (props) => {
  return <div
      className={styles.divider}
      style={{borderWidth: `${props.width ?? 2}px`}}
  ></div>;
};
