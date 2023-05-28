import React, {useEffect, useState} from 'react'
import {observer} from "mobx-react-lite";
import styles from "./TaskListPage.module.scss"
import chevronIcon from "../../assets/img/select/chevron.svg"
import {postamatStore} from "../../mobxStore/postamatStore";
import xMark from "../../assets/img/Xmark.svg";
import {tasksStore, sortOptions} from "../../mobxStore/tasksStore";
import {
    filter,
    taskArchive,
    taskArchiveBlack,
    taskInProgress,
    taskInProgressBlack,
    taskOpen,
    taskOpenBlack
} from "../../assets/img";
import classNames from "classnames";
import {FilterTasks} from "../../components/tasks/FilterTasks/FilterTasks";
import {Sort} from "../../components/common/Sort/Sort";
import {useNavigate, useSearchParams} from "react-router-dom";

export const TaskListPage = observer(() => {
    const navigate = useNavigate()
    let [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get("status") === "in_progress") {
            tasksStore.statusFilter = "in_progress"
        } else {
            tasksStore.statusFilter = "open"
        }
        postamatStore.clearSelection()
    }, [])

    useEffect(() => {
        tasksStore.fetchTasks()
    }, [
        tasksStore.statusFilter,
        tasksStore.selectedCategoryIds.length,
        tasksStore.selectedSourceIds.length,
        tasksStore.sortOptionValue,
        postamatStore.selectedPostamat,
        postamatStore.selectedDistrictIds.length,
    ])

    const isShowAppliedSettings = !!tasksStore.appliedSettingsCount

    useEffect(() => {
        if (!isShowAppliedSettings) {
            setIsAppliedSettingsCardExpanded(false)
        }
    }, [isShowAppliedSettings])

    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isAppliedSettingsCardExpanded, setIsAppliedSettingsCardExpanded] = useState(false)

    const getTopRow = () => {
        return (
            <div className={styles.topRow}>
                <button className={styles.button} onClick={() => setIsFilterOpen(true)}>
                    <img src={filter}/>
                    <p className={styles.btnText}>Фильтр</p>
                </button>

                {isShowAppliedSettings &&
                    <div className={styles.appliedSettingsCard}>
                        <div className={styles.header}
                             onClick={() => {
                                 setIsAppliedSettingsCardExpanded(!isAppliedSettingsCardExpanded)
                             }}
                        >
                            Выбранные настройки{" "}
                            <span className={styles.count}>
                                ({tasksStore.appliedSettingsCount})
                            </span>
                        </div>
                        <button
                            className={styles.expandButton}
                            style={{
                                transform: `rotate(${isAppliedSettingsCardExpanded ? 0 : 180}deg)`
                            }}
                            onClick={(event) => {
                                event.stopPropagation();
                                setIsAppliedSettingsCardExpanded(!isAppliedSettingsCardExpanded)
                            }}
                        >
                            <img src={chevronIcon}/>
                        </button>
                        {isAppliedSettingsCardExpanded &&
                            <div className={styles.chips}>
                                {tasksStore.selectedTask ? (
                                    <div className={styles.chip}>
                                        Задача: {tasksStore.selectedTask.id}
                                        <button className={styles.clearButton}
                                                onClick={() => {
                                                    tasksStore.selectedTask = undefined
                                                }}>
                                            <img src={xMark}/>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {!tasksStore.selectedTask && tasksStore.selectedCategoryIds.map(c_id =>
                                            <div className={styles.chip}>
                                                {tasksStore.getCategoryById(c_id)?.name}
                                                <button className={styles.clearButton}
                                                        onClick={() => tasksStore.toggleCategory(c_id)}>
                                                    <img src={xMark}/>
                                                </button>
                                            </div>
                                        )}
                                        {!tasksStore.selectedTask && tasksStore.selectedSourceIds.map(c_id =>
                                            <div className={styles.chip}>
                                                Источник: {tasksStore.getSourceById(c_id)?.name}
                                                <button className={styles.clearButton}
                                                        onClick={() => tasksStore.toggleSource(c_id)}>
                                                    <img src={xMark}/>
                                                </button>
                                            </div>
                                        )}

                                        {postamatStore.selectedPostamat &&
                                            <div className={styles.chip}>
                                                {postamatStore.selectedPostamat.address}
                                                <button className={styles.clearButton}
                                                        onClick={() => {
                                                            postamatStore.selectedPostamat = undefined
                                                            postamatStore.selectedRegionIds = []
                                                            postamatStore.selectedDistrictIds = []
                                                        }}>
                                                    <img src={xMark}/>
                                                </button>
                                            </div>
                                        }
                                        {!postamatStore.selectedPostamat && postamatStore.selectedDistrictIds.map(district_id =>
                                            <div className={styles.chip}>
                                                Район: {postamatStore.getDistrictById(district_id)?.name}
                                                <button className={styles.clearButton}
                                                        onClick={() => postamatStore.toggleDistrict(district_id)}>
                                                    <img src={xMark}/>
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        }
                    </div>
                }
            </div>
        )
    }

    const isReady = tasksStore.tasks

    const renderContent = () => {
        return (
            <div className={styles.layout}>
                {isReady ? (
                    <>
                        <div className={styles.header}>Задачи</div>
                        {getTopRow()}
                        <div className={styles.divider}/>

                        <div className={styles.tabsRow}>

                            <button className={classNames(styles.tab, styles.tabYellow, {
                                [styles.active]: tasksStore.statusFilter === "in_progress"
                            })}
                                    onClick={() => tasksStore.statusFilter = "in_progress"}
                            >
                                <img src={taskInProgressBlack}/>
                                В процессе
                            </button>
                            <button className={classNames(styles.tab, styles.tabRed, {
                                [styles.active]: tasksStore.statusFilter === "open"
                            })}
                                    onClick={() => tasksStore.statusFilter = "open"}
                            >
                                <img src={taskOpenBlack}/>
                                Требуют решения
                            </button>
                            <button className={classNames(styles.tab, styles.tabGreen, {
                                [styles.active]: tasksStore.statusFilter === "archive"
                            })}
                                    onClick={() => tasksStore.statusFilter = "archive"}
                            >
                                <img src={taskArchiveBlack}/>
                                Архив
                            </button>

                            <div className={styles.sort}>
                                <Sort
                                    options={sortOptions}
                                    value={tasksStore.sortOptionValue}
                                    onChange={value => tasksStore.sortOptionValue = value}
                                />
                            </div>
                        </div>

                        <div className={styles.list}>
                            {tasksStore.filteredTasks?.length === 0 &&
                                <div className={styles.noResults}>
                                    Не найдено задач с таким фильтром
                                </div>
                            }
                            {tasksStore.filteredTasks?.map(t =>
                                <button className={styles.listItem}
                                    onClick={() => navigate(`/tasks/${t.id}`)}
                                >
                                    <div
                                        className={styles.rating}
                                        //style={{backgroundColor: getRatingColor(r.status)}}
                                    >
                                        {t.status === "open" &&
                                            <img src={taskOpen}/>
                                        }
                                        {t.status === "in_progress" &&
                                            <img src={taskInProgress}/>
                                        }
                                        {t.status === "archive" &&
                                            <img src={taskArchive}/>
                                        }
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.category}>
                                            {t.name}
                                        </div>
                                        <div className={styles.address}>
                                            {t.review.postamat_address.replaceAll("/n", "")}
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div className={styles.id}>
                                            {t.id}
                                        </div>
                                        <div className={styles.date}>
                                            {t.created_at}
                                        </div>
                                    </div>
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className={styles.header}>Загрузка...</div>
                )}
            </div>
        )
    }

    if (isFilterOpen) {
        return (
            <FilterTasks
                onClose={() => setIsFilterOpen(false)}
            />
        )
    }

    return renderContent()
})
