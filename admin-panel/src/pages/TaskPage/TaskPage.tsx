import React, {useEffect, useState} from "react";
import styles from "./TaskPage.module.scss";
import {arrowBack, taskCompleted} from "../../assets/img";
import {Divider} from "../../components/common/Divider/Divider";
import classNames from "classnames";
import {useNavigate, useParams} from "react-router-dom";
import {observer} from "mobx-react-lite";
import axios from "axios";
import {domain} from "../../constants/config";
import {ITask} from "../../mobxStore/tasksStore";

export const TaskPage = observer(() => {
    const navigate = useNavigate()

    const {id} = useParams()

    const [task, setTask] = useState<ITask>()

    const fetchReview = async () => {
        const res = await axios.get(`${domain}/api/admin/tasks/${id}`)
        setTask(res.data)
    }

    useEffect(() => {
        fetchReview()
    }, [])

    if (!task) {
        return (
            <div className={styles.body}>
                <div className={styles.header}>
                    <button className={styles.buttonBack} onClick={() => navigate("/tasks")}>
                        <img src={arrowBack} alt="" />
                    </button>
                    <div className={styles.headerText}>Загрузка ...</div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <button className={styles.buttonBack} onClick={() => navigate("/tasks")}>
                    <img src={arrowBack} alt=""/>
                </button>
                <div className={styles.headerText}>Задача — {id} </div>
            </div>
            <Divider/>
            <div className={styles.content}>
                <div className={styles.leftSide}>
                    <div className={styles.userData}>
                        <div className={styles.headText}>Задача</div>
                        <div className={styles.taskInfo}>
                            <div className={styles.sourceContainer}>
                                <div className={styles.sourceHeader}>Дата создания задачи</div>
                                <div className={styles.sourceText}>{task.created_at}</div>
                            </div>
                            <Divider width={1}/>
                            <div className={styles.sourceContainer}>
                                <div className={styles.sourceHeader}>Тип проблемы</div>
                                <div className={styles.sourceText}>{task.name}</div>
                            </div>

                            <div className={styles.bottom}>
                                <button className={classNames(
                                    styles.button, {
                                        [styles.yellow]: task.status === "in_progress",
                                        [styles.green]: task.status === "archive",
                                        [styles.red]: task.status === "open"
                                    }
                                )}
                                    onClick={() => {
                                        if (task?.status === "open") {
                                            task.status = "in_progress"
                                        } else if (task?.status === "in_progress") {
                                            task.status = "archive"
                                        } else if (task?.status === "archive") {
                                            task.status = "in_progress"
                                        }
                                        axios.post(`${domain}/api/admin/tasks/${task.id}/set-status`, {
                                            status: task.status
                                        })
                                        setTask({...task})
                                    }}
                                >
                                    {task.status === "open" && "Решить"}
                                    {task.status === "in_progress" && "В работе"}
                                    {task.status === "archive" && "Решено"}
                                </button>

                                {task.status === "archive" &&
                                    <img src={taskCompleted}/>
                                }
                            </div>
                        </div>

                        <div className={styles.headText}>Данные пользователя</div>
                        <div className={styles.userDataConteiner}>
                            <div className={styles.userDataContent}>
                                <div className={styles.subText}>Имя</div>
                                <div className={styles.text}>{task.review.user_name}</div>
                                <div className={styles.subTextMob}>Телефон</div>
                                <div className={styles.text}>{task.review.user_phone}</div>
                            </div>
                        </div>

                        <div className={styles.postamatHead}>Постамат</div>
                        <div className={styles.postamatContainer}>
                            <div className={styles.postamatId}>
                                <div>{task.review.postamat_id}</div>
                            </div>
                            <div className={styles.postamatAdress}>{task.review.postamat_address}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.rightSide}>
                    <div className={styles.headText}>Отзыв</div>
                    <div className={styles.reviewContainer}>
                        <div className={styles.reviewContent}>
                            <div className={styles.ratingContainer}>
                                <div className={classNames(styles.rating, {
                                    [styles.ratingBad]: task.review.rating < 3,
                                    [styles.ratingNormal]: task.review.rating === 3,
                                    [styles.ratingGood]: task.review.rating >= 4,
                                })}>{task.review.rating}</div>
                                <div className={styles.ratingText}>
                                    Оценка <br/> пользователя
                                </div>
                            </div>
                            <Divider width={1}/>
                            <div className={styles.sourceContainer}>
                                <div className={styles.sourceHeader}>Источник</div>
                                <div className={styles.sourceText}>{task.review.source_name}</div>
                            </div>
                            <Divider width={1}/>
                            <div className={styles.commentContainer}>
                                <div className={styles.commentHeader}>
                                    Содержимое комментария:
                                </div>
                                <div className={styles.commentText}>{task.review.comment}</div>
                            </div>
                            <div className={styles.tagsContainer}>
                                <div className={styles.tagsHeader}>Категории</div>
                                <div className={styles.tagsArray}>
                                    {task.review.categories.map((el) => <div className={styles.tag} key={el}>{el}</div>)}
                                </div>
                            </div>
                            <div className={styles.taskHead}>Связанный отзыв</div>
                            <div className={styles.task}
                                onClick={() => navigate(`/reviews/${task?.review.id}`)}
                            >№{task.review.id}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
