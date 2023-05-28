import React from "react";
import styles from "./MyButton.module.scss";
import classNames from "classnames";

export const MyButton = ({ whiteButton,redButton, onClick, disabled, children,type }) => {
  return (
    <button
      className={(classNames(styles.button, {[styles.whiteButton]:whiteButton,[styles.redButton]:redButton}))}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};
