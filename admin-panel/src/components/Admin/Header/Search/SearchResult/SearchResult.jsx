import React from "react";
import styles from "./SearchResult.module.scss";
import { observer } from "mobx-react-lite";
import { SearchStore, searchStore } from "../../../../../mobxStore/store";
import { Divider } from "../../../../common/Divider/Divider";
import { xmark } from "../../../../../assets/img";
import { ReactComponent as Arrow } from "../../../../../assets/img/Arrow.svg";
import { CommentCard } from "./CommentCard/CommentCard";
import { SearchTaskCard } from "./SearchTaskCard/SearchTaskCard";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

export const SearchResult = observer(() => {
  const navigate = useNavigate();
  const [isHoveredTask, setIsHoveredTask] = React.useState(false);
  const handleHoverTask = () => {
    setIsHoveredTask(true);
  };

  const handleLeaveTask = () => {
    setIsHoveredTask(false);
  };
  const [isHovered, setIsHovered] = React.useState(false);
  const handleHover = () => {
    setIsHovered(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
  };
  let reviewsArray = [];
  let tasksArray = [];
  if (Object.keys(searchStore.reviews).length > 0) {
    reviewsArray = searchStore.reviews.result.slice(0, 3);
  }
  if (Object.keys(searchStore.tasks).length > 0) {
    tasksArray = searchStore.tasks.result.slice(0, 3);
    console.log({ tasksArray });
  }

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <div className={styles.head}>Результаты поиска</div>{" "}
        <button className={styles.button} onClick={() => navigate(-1)}>
          <img src={xmark} alt="" />
        </button>
      </header>
      <div className={styles.divider}></div>
      {!reviewsArray[0] && !tasksArray[0] ? (
        <div className={styles.wrongSearch}>
          Ничего не нашлось:( <br /> Попробуйте изменить вариант запроса...{" "}
        </div>
      ) : (
        <></>
      )}
      {!reviewsArray[0] ? (
        <></>
      ) : (
        <>
          <div className={styles.subHead}>Отзывы</div>
          <button
            className={styles.subHeadText}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            onClick={() => navigate("/reviews")}
          >
            <p>
              Посмотреть все отзывы
            </p>{" "}
            <Arrow
              className={classNames({
                [styles.arrowActive]: isHovered,
              })}
            />
          </button>
          <div className={styles.cardBlock}>
            {reviewsArray.map((el) => (
              <CommentCard
                id={el.id}
                address={el.postamat_address}
                rating={el.rating}
                types={el.categories}
                date={el.date}
              />
            ))}
          </div>
        </>
      )}
      {!tasksArray[0] ? (
        <></>
      ) : (
        <>
          <div className={styles.subHead}>Задачи</div>
          <button className={styles.subHeadText}
          onMouseEnter={handleHoverTask}
          onMouseLeave={handleLeaveTask}
          onClick={() => navigate("/tasks")}
          >
            <p>Посмотреть все задачи</p>{" "}
            <Arrow
                className={classNames({
                  [styles.arrowActive]: isHoveredTask,
                })}
              />
          </button>
          <div className={styles.cardBlock}>
            {tasksArray.map((el) => (
              <SearchTaskCard
                category={el.name}
                key={el.id}
                id={el.review.id}
                date={el.created_at}
                address={el.review.postamat_address}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});
