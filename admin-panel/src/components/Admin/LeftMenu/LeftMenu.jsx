import React from "react";
import styles from "./LeftMenu.module.scss";
import { LeftMenuItem } from "./LeftMenuItem/LeftMenuItem";
import { navRoutes } from "../../../routes/navRoutes";
import { useSelector } from "react-redux";
export const LeftMenu = () => {
  const userRoot = useSelector((state) => state.auth.auth.role);
  const userRootArray = navRoutes.filter((i) => i.path !=="/Access");
  return (
    <div className={styles.navbar}>
      {userRoot !=="user"
        ? navRoutes
            .map((route) => (
              <LeftMenuItem
                icon={route.icon}
                element={route.element}
                path={route.path}
                name={route.name}
                key={route.path}
              />
            ))
        : userRootArray.map((route) => (
            <LeftMenuItem
              icon={route.icon}
              element={route.element}
              path={route.path}
              name={route.name}
              key={route.path}
            />
          ))}
    </div>
  );
};
