import React, {useEffect, useMemo, useState} from 'react'
import {observer} from "mobx-react-lite";
import styles from "./PostamatListPage.module.scss"
import {analyticsStore} from "../../mobxStore/analyticsStore";
import {FilterPostamat} from "../../components/analytics/FilterPostamat/FilterPostamat";
import chevronIcon from "../../assets/img/select/chevron.svg"
import {postamatStore} from "../../mobxStore/postamatStore";
import xMark from "../../assets/img/Xmark.svg";
import {useNavigate} from "react-router-dom";
import {filter, mapPin, pinRed, postamats} from "../../assets/img";
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
function getRandomInt(max: number) {
    return Math.floor(Math.random() * max) - max/2;
}
export const PostamatListPage = observer(() => {
    const navigate = useNavigate()
    const [isShowMapsOverlay, setShowMapsOverlay] = useState(false)

    useEffect(() => {
        postamatStore.clearSelection()
        postamatStore.fetchPostamats()
    }, [])

    const [isFilterPostamatOpen, setIsFilterPostamatOpen] = useState(false)
    const [isAppliedSettingsCardExpanded, setIsAppliedSettingsCardExpanded] = useState(false)
    const [balloonCoords, setBalloonCoords] = React.useState(null);

    const handlePlacemarkMouseEnter = (event: any) => {
        setBalloonCoords(event.get('target').geometry.getCoordinates());
    };

    const handlePlacemarkMouseLeave = () => {
        setBalloonCoords(null);
    };

    const [address, setAddress] = useState("");

    const placemarks = useMemo(() => {
        return postamatStore.filteredPostamats?.map(p =>
            <Placemark
                geometry={[
                    55.73 + getRandomInt(80000)/320000,
                    37.64 + getRandomInt(90000)/310000
                ]}
                properties={{
                    hintContent: p.address,
                }}
                modules={
                    ['geoObject.addon.balloon', 'geoObject.addon.hint']
                }
                onClick={() => {
                    postamatStore.selectedPostamat = p;
                    setShowMapsOverlay(false);
                    setAddress("");
                }}
                onMouseEnter={() => setAddress(p.address)}
                onMouseLeave={() => setAddress("")}
            />
        )
    }, [postamatStore.filteredPostamats?.length, postamatStore.filteredPostamats])
    const getTopRow = () => {
        return (
            <div className={styles.topRow}>
                <button className={styles.button} onClick={() => setIsFilterPostamatOpen(true)}>
                    <p className={styles.btnText}>Настроить показ постаматов</p>
                </button>
                <button className={styles.button} onClick={() => {setShowMapsOverlay(true)}}>
                    <img src={mapPin}/>
                    <p className={styles.btnText}>Показать на карте</p>
                </button>
                {isShowMapsOverlay &&
                    <div className={styles.overlay} onClick={() => {
                        setShowMapsOverlay(false);
                        setAddress("");
                    }}>
                        <div className={styles.overlayContent} onClick={(event) => event.stopPropagation()}>
                            <YMaps query={{
                                apikey: 'dd349044-d41a-45f3-bf51-117ddbba5081',
                            }}>
                                <Map width={"100%"} height={"90%"} defaultState={{
                                    center: [55.741574, 37.573856],
                                    zoom: 10,
                                }}
                                >
                                    {placemarks}
                                </Map>
                            </YMaps>
                            <div className={styles.address}>
                                <img src={pinRed}/>
                                {address || postamatStore.selectedPostamat?.address || "Выберите постамат"}
                            </div>
                        </div>
                    </div>
                }
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
