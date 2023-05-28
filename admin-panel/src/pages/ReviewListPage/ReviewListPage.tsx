import React, {useEffect, useState} from 'react'
import {observer} from "mobx-react-lite";
import styles from "./ReviewListPage.module.scss"
import chevronIcon from "../../assets/img/select/chevron.svg"
import {postamatStore} from "../../mobxStore/postamatStore";
import xMark from "../../assets/img/Xmark.svg";
import {reviewsStore, sortOptions} from "../../mobxStore/reviewsStore";
import {filter} from "../../assets/img";
import classNames from "classnames";
import {FilterReviews} from "../../components/reviews/FilterReviews/FilterReviews";
import {Sort} from "../../components/common/Sort/Sort";

import * as XLSX from 'xlsx';
import {useNavigate} from "react-router-dom";

function exportToExcel(jsonData: any) {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(jsonData.map((d: any) => ({
        ...d,
        categories: d.categories.join(","),
        category_ids: d.category_ids.join(",")
    })));
    XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
    XLSX.writeFile(workbook, 'Отзывы.xlsx');
}

export const ReviewListPage = observer(() => {
    const navigate = useNavigate()

    useEffect(() => {
        postamatStore.clearSelection()
    }, [])

    useEffect(() => {
        reviewsStore.fetchReviews()
    }, [
        reviewsStore.ratingFilter,
        reviewsStore.selectedCategoryIds.length,
        reviewsStore.selectedSourceIds.length,
        reviewsStore.sortOptionValue,
        postamatStore.selectedPostamat,
        postamatStore.selectedDistrictIds.length,
    ])

    const isShowAppliedSettings = !!reviewsStore.appliedSettingsCount

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
                                ({reviewsStore.appliedSettingsCount})
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
                                {reviewsStore.selectedReview ? (
                                    <div className={styles.chip}>
                                        Отзыв: №{reviewsStore.selectedReview.id}
                                        <button className={styles.clearButton}
                                                onClick={() => {
                                                    reviewsStore.selectedReview = undefined
                                                }}>
                                            <img src={xMark}/>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {reviewsStore.ratingFilter !== "all" &&
                                            <div className={styles.chip}>
                                                Рейтинг: {reviewsStore.ratingFilter}
                                                <button className={styles.clearButton}
                                                        onClick={() => {
                                                            reviewsStore.ratingFilter = "all"
                                                        }}>
                                                    <img src={xMark}/>
                                                </button>
                                            </div>
                                        }
                                        {!reviewsStore.selectedReview && reviewsStore.selectedCategoryIds.map(c_id =>
                                            <div className={styles.chip}>
                                                {reviewsStore.getCategoryById(c_id)?.name}
                                                <button className={styles.clearButton}
                                                        onClick={() => reviewsStore.toggleCategory(c_id)}>
                                                    <img src={xMark}/>
                                                </button>
                                            </div>
                                        )}
                                        {!reviewsStore.selectedReview && reviewsStore.selectedSourceIds.map(c_id =>
                                            <div className={styles.chip}>
                                                Источник: {reviewsStore.getSourceById(c_id)?.name}
                                                <button className={styles.clearButton}
                                                        onClick={() => reviewsStore.toggleSource(c_id)}>
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

    const isReady = reviewsStore.reviews

    const getRatingColor = (rating: number) => {
        if (rating > 3) {
            return "#00B333"
        } else if (rating == 3) {
            return "#F0BC00"
        }
        return "#FF1935"
    }

    const renderContent = () => {
        return (
            <div className={styles.layout}>
                {isReady ? (
                    <>
                        <div className={styles.header}>Отзывы</div>
                        {getTopRow()}
                        <div className={styles.divider}/>

                        <div className={styles.tabsRow}>
                            <button className={classNames(styles.tab, styles.tabAll, {
                                [styles.active]: reviewsStore.ratingFilter === "all"
                            })}
                                    onClick={() => reviewsStore.ratingFilter = "all"}
                            >
                                Все
                            </button>
                            <button className={classNames(styles.tab, styles.tabGreen, {
                                [styles.active]: reviewsStore.ratingFilter === "5-4"
                            })}
                                    onClick={() => reviewsStore.ratingFilter = "5-4"}
                            >
                                5-4
                            </button>
                            <button className={classNames(styles.tab, styles.tabYellow, {
                                [styles.active]: reviewsStore.ratingFilter === "3"
                            })}
                                    onClick={() => reviewsStore.ratingFilter = "3"}
                            >
                                3
                            </button>
                            <button className={classNames(styles.tab, styles.tabRed, {
                                [styles.active]: reviewsStore.ratingFilter === "2-1"
                            })}
                                    onClick={() => reviewsStore.ratingFilter = "2-1"}
                            >
                                2-1
                            </button>

                            <button
                                className={classNames(styles.button, styles.exportToXls)}
                                onClick={() => exportToExcel(reviewsStore.filteredReviews)}
                            >
                                Экспорт в XLS
                            </button>

                            <div className={styles.sort}>
                                <Sort
                                    options={sortOptions}
                                    value={reviewsStore.sortOptionValue}
                                    onChange={value => reviewsStore.sortOptionValue = value}
                                />
                            </div>
                        </div>

                        <div className={styles.list}>
                            {reviewsStore.filteredReviews?.map(r =>
                                <button className={styles.listItem}
                                    onClick={() => navigate(`/reviews/${r.id}`)}
                                >
                                    <div
                                        className={styles.rating}
                                        style={{backgroundColor: getRatingColor(r.rating)}}
                                    >
                                        {r.rating}
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.categories}>
                                            {r.categories.map(c =>
                                                <div className={styles.category}>
                                                    {c}
                                                </div>
                                            )}
                                            {r.categories.length === 0 &&
                                                <div className={styles.category}>
                                                    Категории не определены
                                                </div>
                                            }
                                        </div>
                                        <div className={styles.address}>
                                            {r.postamat_address.replaceAll("/n", "")}
                                        </div>
                                    </div>
                                    <div className={styles.right}>
                                        <div className={styles.id}>
                                            №{r.id}
                                        </div>
                                        <div className={styles.date}>
                                            {r.date}
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
            <FilterReviews
                onClose={() => setIsFilterOpen(false)}
            />
        )
    }

    return renderContent()
})
