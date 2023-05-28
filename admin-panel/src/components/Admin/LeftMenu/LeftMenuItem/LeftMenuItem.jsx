import React from "react";
import styles from "./LeftMenuItem.module.scss";
import { NavLink } from "react-router-dom";
import classNames from "classnames";

export const LeftMenuItem = ({ path, icon, name }) => {
  return (
    <div className={styles.link}>
      <NavLink
        to={path}
        className={({ isActive }) =>
          classNames(styles.navLink, {
            [styles.navLinkActive]: isActive,
          })
        }
        key={path}
        end
      >
        <img src={icon} alt=""/> <div className={styles.itemText}>{name}</div>
      </NavLink>
    </div>
  );
};
