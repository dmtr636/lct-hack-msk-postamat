import React from "react";
import styles from "./AdminPage.module.scss";
import { SideBar } from "../../components/Admin/SideBar/SideBar";
import { Header } from "../../components/Admin/Header/Header";
import { Route, Routes } from "react-router-dom";
import { navRoutes } from "../../routes/navRoutes";

import { observer } from "mobx-react-lite";
import { searchStore } from "../../mobxStore/store";
import { SearchResult } from "../../components/Admin/Header/Search/SearchResult/SearchResult";
import { arrowUp } from "../../assets/img";
import {ReviewPage} from "../ReviewPage/ReviewPage";
import {TaskPage} from "../TaskPage/TaskPage";
import { LoadDataModal } from "../../components/Admin/LeftMenu/sideBarScreen/loadDataModal";


export const AdminPage = observer(() => {
  const scrollToTop = React.useRef(null);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <div className={styles.body}>
        <SideBar />
        <div className={styles.content}>
          <Header />
          <button
            className={styles.scrollToTopButton}
            onClick={handleScrollToTop}
            ref={scrollToTop}
          > <img src={arrowUp} alt="" /></button>
           <div ref={scrollToTop}></div>
          <Routes>
            {navRoutes.map((route) => (
              <Route
                path={route.path}
                element={route.element}
                key={route.path}
              />
            ))}

            <Route path="/search" element={<SearchResult />} />

            <Route path={"/reviews/:id"} element={<ReviewPage/>} />
            <Route path={"/tasks/:id"} element={<TaskPage/>} />
          </Routes>
        </div>

      </div>
    </>
  );
});
