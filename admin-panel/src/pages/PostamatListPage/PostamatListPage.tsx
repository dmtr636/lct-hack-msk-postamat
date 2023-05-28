import React, {useEffect, useState} from 'react'
import {observer} from "mobx-react-lite";
import styles from "./PostamatListPage.module.scss"
import {analyticsStore} from "../../mobxStore/analyticsStore";
import {FilterPostamat} from "../../components/analytics/FilterPostamat/FilterPostamat";
import chevronIcon from "../../assets/img/select/chevron.svg"
import {postamatStore} from "../../mobxStore/postamatStore";
import xMark from "../../assets/img/Xmark.svg";
import {useNavigate} from "react-router-dom";

export const PostamatListPage = observer(() => {
    const navigate = useNavigate()

    useEffect(() => {
        postamatStore.clearSelection()
        postamatStore.fetchPostamats()
    }, [])

    const [isFilterPostamatOpen, setIsFilterPostamatOpen] = useState(false)
    const [isAppliedSettingsCardExpanded, setIsAppliedSettingsCardExpanded] = useState(false)

    const getTopRow = () => {
        return (
            <div className={styles.topRow}>
                <button className={styles.button} onClick={() => setIsFilterPostamatOpen(true)}>
                    <p className={styles.btnText}>Настроить показ постаматов</p>
                </button>
            </div>
        )
    }

    const isReady = postamatStore.postamats

    const renderContent = () => {
        return (
            <div className={styles.layout}>
                {isReady ? (
                    <>
                        <div className={styles.header}>Постаматы</div>
                        {getTopRow()}
                        <div className={styles.divider}/>
                        {(postamatStore.selectedPostamat || postamatStore.selectedDistrictIds.length > 0) &&
                            <div className={styles.appliedSettingsCard}>
                                <div className={styles.header}
                                     onClick={() => {
                                         setIsAppliedSettingsCardExpanded(!isAppliedSettingsCardExpanded)
                                     }}
                                >
                                    Выбранные настройки{" "}
                                    <span className={styles.count}>
                                        ({analyticsStore.appliedSettingsCount})
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
                                    </div>
                                }
                            </div>
                        }
                        <div className={styles.h2}>
                            Показывается постаматов <span className={styles.count}>({postamatStore.filteredPostamats?.length})</span>
                        </div>
                        <div className={styles.list}>
                            {postamatStore.filteredPostamats?.map(p =>
                                <button className={styles.listItem}
                                    onClick={() => {
                                        navigate("/reviews")
                                        setTimeout(() => postamatStore.selectedPostamat = p)
                                    }}
                                >
                                    <div className={styles.id}>{p.id}</div>
                                    {p.address}
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

    if (isFilterPostamatOpen) {
        return (
            <FilterPostamat
                onClose={() => setIsFilterPostamatOpen(false)}
            />
        )
    }

    return renderContent()
})
