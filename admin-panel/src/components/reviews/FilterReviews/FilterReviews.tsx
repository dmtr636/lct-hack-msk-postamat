import React, {useEffect} from 'react';
import {observer} from "mobx-react-lite";
import styles from "./FilterReviews.module.scss"
import xMark from "../../../assets/img/Xmark.svg"
import searchIcon from "../../../assets/img/search.svg"
import {postamatStore} from "../../../mobxStore/postamatStore";
import classNames from "classnames";
import {reviewsStore} from "../../../mobxStore/reviewsStore";
import {sources} from "../../../constants/sources";
import {categories} from "../../../constants/categories";

export const FilterReviews = observer((props: {
    onClose: () => void
}) => {
    useEffect(() => {
        postamatStore.fetchRegions()
        postamatStore.fetchDistricts()
        postamatStore.fetchPostamats()
    }, [])

    const isReady =
        postamatStore.regions &&
        postamatStore.districts &&
        postamatStore.postamats

    const renderSelectRegion = () => {
        return (
            <div className={classNames(styles.selectDistrictGrid, {
                [styles.disabled]: postamatStore.selectedPostamat || reviewsStore.selectedReview
            })}>
                <div>
                    <div className={styles.colHeader}>Округ</div>
                    <div className={styles.groupsCol}>
                        {Object
                            .entries(postamatStore.groupByFirstLetter(postamatStore.regions))
                            .map(([key, value]: [string, any]) => (
                                <div className={styles.group}>
                                    <div className={styles.letter}>
                                        {key}
                                    </div>
                                    {value.map((region: any) =>
                                        <button
                                            className={styles.groupItem}
                                            onClick={() => postamatStore.toggleRegion(region.id)}
                                        >
                                            <div
                                                className={classNames(styles.checkbox, {
                                                    [styles.checked]: postamatStore.isRegionSelected(region.id)
                                                })}
                                            />
                                            <div className={classNames(styles.groupItemText, {
                                                [styles.checked]: postamatStore.isRegionSelected(region.id)
                                            })}>
                                                {region.name}
                                            </div>
                                        </button>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>

                <div>
                    <div className={styles.colHeader}>Район</div>
                    <div className={styles.groupsColDistricts}>
                        {Object
                            .entries(postamatStore.groupByFirstLetter(postamatStore.filteredDistricts))
                            .map(([key, value]: [string, any]) => (
                                <div className={styles.group}>
                                    <div className={styles.letter}>
                                        {key}
                                    </div>
                                    {value.map((region: any) =>
                                        <button
                                            className={styles.groupItem}
                                            onClick={() => postamatStore.toggleDistrict(region.id)}
                                        >
                                            <div
                                                className={classNames(styles.checkbox, {
                                                    [styles.checked]: postamatStore.isDistrictSelected(region.id)
                                                })}
                                            />
                                            <div className={classNames(styles.groupItemText, {
                                                [styles.checked]: postamatStore.isDistrictSelected(region.id)
                                            })}>
                                                {region.name}
                                            </div>
                                        </button>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        )
    }

    const renderSelectReviewFilters = () => {
        return (
            <div className={classNames(styles.selectCategoryRatingGrid, {
                [styles.disabled]: reviewsStore.selectedReview
            })}>
                <div>
                    <div className={styles.colHeader}>Категория</div>
                    <div className={styles.categoryGroup}>
                        {categories.map(c =>
                            <button
                                className={styles.groupItem}
                                onClick={() => reviewsStore.toggleCategory(c.id)}
                            >
                                <div
                                    className={classNames(styles.checkbox, {
                                        [styles.checked]: reviewsStore.isCategorySelected(c.id)
                                    })}
                                />
                                <div className={classNames(styles.groupItemText, {
                                    [styles.checked]: reviewsStore.isCategorySelected(c.id)
                                })}>
                                    {c.name}
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <div className={styles.colHeader}>Источник</div>
                    <div className={styles.categoryGroup}>
                        {sources.map(r =>
                            <button
                                className={styles.groupItem}
                                onClick={() => reviewsStore.toggleSource(r.id)}
                            >
                                <div
                                    className={classNames(styles.checkbox, {
                                        [styles.checked]: reviewsStore.isSourceSelected(r.id)
                                    })}
                                />
                                <div className={classNames(styles.groupItemText, {
                                    [styles.checked]: reviewsStore.isSourceSelected(r.id)
                                })}>
                                    {r.name}
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.bg}>
            <div className={styles.layout}>
                <div className={styles.header}>
                    Фильтры
                    <button className={styles.closeButton} onClick={() => props.onClose()}>
                        <img src={xMark}/>
                    </button>
                </div>
                <div className={styles.divider}/>

                <div className={styles.searchReviewHeader}>
                    Найти отзыв по ID
                </div>
                <div className={styles.searchRow}>
                    <div className={styles.inputWrapper}>
                        <input
                            value={reviewsStore.selectedReview
                                ? `№${reviewsStore.selectedReview.id}`
                                : reviewsStore.searchValue
                            }
                            onChange={(event) => reviewsStore.searchValue = event.target.value}
                            className={styles.input}
                            placeholder={"Например, №343454"}
                            disabled={!!reviewsStore.selectedReview}
                            onBlur={() => setTimeout(() => reviewsStore.searchValue = "")}
                        />
                        <img src={searchIcon} className={styles.searchIcon}/>
                        {reviewsStore.selectedReview &&
                            <button
                                className={styles.clearSearch}
                                onClick={() => reviewsStore.selectedReview = undefined}
                            >
                                <img src={xMark}/>
                            </button>
                        }
                        {(reviewsStore.searchValue.length > 0 && (reviewsStore.searchOptions?.length ?? 0) > 0) &&
                            <div className={styles.searchOptions}>
                                {reviewsStore.searchOptions?.map(r =>
                                    <button
                                        className={styles.searchOption}
                                        onMouseDown={() => {
                                            reviewsStore.selectedReview = r
                                            reviewsStore.searchValue = ""
                                        }}
                                    >
                                        №{r.id}
                                    </button>
                                )}
                            </div>
                        }
                    </div>
                    <button
                        className={styles.selectAllButton}
                        onClick={() => reviewsStore.selectAll()}
                    >
                        Выбрать все
                    </button>
                    <button
                        className={styles.clearSelectionButton}
                        onClick={() => reviewsStore.clearSelection()}
                    >
                        Очистить выбор
                    </button>
                </div>

                {renderSelectReviewFilters()}

                <div className={styles.locationHeader}>
                    Локация
                </div>

                <div className={styles.searchRow}>
                    <div className={styles.inputWrapper}>
                        <input
                            value={postamatStore.selectedPostamat?.address ?? postamatStore.searchValue}
                            onChange={(event) => postamatStore.searchValue = event.target.value}
                            className={styles.input}
                            placeholder={"Адрес постамата"}
                            disabled={!!postamatStore.selectedPostamat || !!reviewsStore.selectedReview}
                        />
                        <img src={searchIcon} className={styles.searchIcon}/>
                        {postamatStore.selectedPostamat &&
                            <button
                                className={styles.clearSearch}
                                onClick={() => postamatStore.selectedPostamat = undefined}
                            >
                                <img src={xMark}/>
                            </button>
                        }
                        {(postamatStore.searchValue.length > 0 && (postamatStore.searchOptions?.length ?? 0) > 0) &&
                            <div className={styles.searchOptions}>
                                {postamatStore.searchOptions?.map(p =>
                                    <button
                                        className={styles.searchOption}
                                        onClick={() => {
                                            postamatStore.selectedPostamat = p
                                            postamatStore.searchValue = ""
                                        }}
                                    >
                                        {p.address}
                                    </button>
                                )}
                            </div>
                        }
                    </div>
                    <button
                        className={styles.selectAllButton}
                        onClick={() => postamatStore.selectAll()}
                    >
                        Выбрать все
                    </button>
                    <button
                        className={styles.clearSelectionButton}
                        onClick={() => postamatStore.clearSelection()}
                    >
                        Очистить выбор
                    </button>
                </div>
                {isReady && renderSelectRegion()}
            </div>
        </div>
    );
});

