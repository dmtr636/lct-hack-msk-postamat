import React, {useEffect, useRef, useState} from 'react'
import {observer} from "mobx-react-lite";
import styles from "./AnalyticsPage.module.scss"
import {analyticsStore} from "../../mobxStore/analyticsStore";
import {Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis} from "recharts";
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import {Select} from "../../components/common/Select/Select";
import {FilterPostamat} from "../../components/analytics/FilterPostamat/FilterPostamat";
import chevronIcon from "../../assets/img/select/chevron.svg"
import xMark from "../../assets/img/Xmark.svg"
import {postamatStore} from "../../mobxStore/postamatStore";

const COLORS = ['#30FF6B', '#FFE586', '#FF4D4D'];

const periodOptions = [
    {
        name: "Неделя",
        value: "week"
    },
    {
        name: "Месяц",
        value: "month"
    },
    {
        name: "Год",
        value: "year"
    },
    {
        name: "Весь период",
        value: "all"
    }
]

export const AnalyticsPage = observer(() => {
    useEffect(() => {
        postamatStore.clearSelection()
    }, [])

    useEffect(() => {
        analyticsStore.fetchRatingCountData()
        analyticsStore.fetchAvgRating()
        analyticsStore.fetchRatingSeries()
        analyticsStore.fetchAppliedReviewCategories()
        analyticsStore.fetchAppliedTaskCategories()
    }, [
        analyticsStore.period,
        postamatStore.selectedPostamat,
        postamatStore.selectedRegionIds.length,
        postamatStore.selectedDistrictIds.length
    ])

    const [isFilterPostamatOpen, setIsFilterPostamatOpen] = useState(false)
    const [isAppliedSettingsCardExpanded, setIsAppliedSettingsCardExpanded] = useState(false)

    const componentRef = useRef(null);
    const handleDownloadImage = async () => {
        const element = componentRef.current!;
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png', 1);
        const pdf = new jsPDF();
        pdf.addImage(data, 'PNG', 10, 10, 197, 250);
        pdf.save("Аналитика.pdf");
    };

    const getTopRow = () => {
        return (
            <div className={styles.topRow}>
                <button className={styles.button} onClick={() => setIsFilterPostamatOpen(true)}>
                    <p className={styles.btnText}>Настроить показ постаматов</p>
                </button>
                <Select
                    options={periodOptions}
                    value={analyticsStore.period}
                    onChange={(value) => analyticsStore.period = value}
                    className={styles.select}
                />
                <div className={styles.exportButton}>
                    <button className={styles.button} onClick={handleDownloadImage}>
                        <p className={styles.btnText}>Экспорт в PDF</p>
                    </button>
                </div>
            </div>
        )
    }

    const getRatingCharts = () => {
        const ratingCountData = [
            {name: "45", value: analyticsStore.ratingCount?.rating45},
            {name: "45", value: analyticsStore.ratingCount?.rating3},
            {name: "45", value: analyticsStore.ratingCount?.rating12}
        ]
        const ratingCountPercentages = analyticsStore.getRatingCountPercentages();

        return (
            <div className={styles.rowRating}>
                <div>
                    <div className={styles.cardHeader}>
                        Средняя оценка
                    </div>
                    <div className={styles.avgRatingCard}>
                        <PieChart width={214} height={214}>
                            <Pie
                                data={ratingCountData}
                                fill="#8884d8"
                                dataKey="value"
                                width={214}
                                height={214}
                                innerRadius={50}
                                outerRadius={"100%"}
                            >
                                {ratingCountData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                        </PieChart>
                        <div className={styles.avgRating}>{analyticsStore.avgRating?.toFixed(1)}</div>
                        <div className={styles.avgRatingCard2Col}>
                            <div className={styles.avgRatingCircleGreen}>
                                {Math.round(ratingCountPercentages[0])}%
                            </div>
                            <div className={styles.avgRatingValues}>
                                <div className={styles.avgRatingValuesHeader}>
                                    Оценка 4-5
                                </div>
                                <div className={styles.avgRatingValuesDescription}>
                                    Комментариев: {ratingCountData[0].value}
                                </div>
                            </div>
                            <div className={styles.avgRatingCircleYellow}>
                                {Math.round(ratingCountPercentages[1])}%
                            </div>
                            <div className={styles.avgRatingValues}>
                                <div className={styles.avgRatingValuesHeader}>
                                    Оценка 3
                                </div>
                                <div className={styles.avgRatingValuesDescription}>
                                    Комментариев: {ratingCountData[1].value}
                                </div>
                            </div>
                            <div className={styles.avgRatingCircleRed}>
                                {Math.round(ratingCountPercentages[2])}%
                            </div>
                            <div className={styles.avgRatingValues}>
                                <div className={styles.avgRatingValuesHeader}>
                                    Оценка 1-2
                                </div>
                                <div className={styles.avgRatingValuesDescription}>
                                    Комментариев: {ratingCountData[2].value}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={styles.cardHeader}>
                        Динамика средней оценки
                    </div>
                    <div className={styles.cardRatingSeries}>
                        <LineChart
                            width={370}
                            height={246}
                            data={analyticsStore.ratingSeriesFormatted ?? []}
                            margin={{
                                left: -40,
                                right: 40
                            }}
                        >
                            <Tooltip/>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="period" padding={{left: 10, right: 20}}/>
                            <YAxis domain={[1, 5]} padding={{top: 20}}/>
                            <Line
                                type="monotone"
                                dataKey="avg_rating"
                                stroke="#FF1935"
                                strokeWidth={3}
                                dot={{r: 6}}
                                name={"Средняя оценка"}
                            />
                        </LineChart>
                    </div>
                </div>
            </div>
        )
    }

    const getReviewsCategoriesChart = () => {
        const colors = ["#A2A7DE", "#B8DED5", "#B9FFA1", "#C3DEA2", "#DED3AD", "#FF7AED", "#FF926E", "#30FF6B", "#FF4C4C"]
        const percentages = analyticsStore.appliedReviewCategoriesPercentages

        return (
            <div className={styles.fullWidthRow}>
                <div className={styles.cardHeader}>
                    Количество применённых категорий
                </div>
                <div className={styles.reviewCategoriesCard}>
                    <div>
                        <BarChart width={612} height={231} data={analyticsStore.appliedReviewCategories}>
                            <Tooltip cursor={{fill: "#EAEEF4"}} contentStyle={{color: "#2F3342"}}
                                     itemStyle={{color: "#9DA1AE"}}
                            />
                            <XAxis dataKey="name" hide={true}/>
                            <Bar dataKey="count" fill="#8884d8" barSize={53} name={"Количество"}>
                                {analyticsStore.appliedReviewCategories?.map((entry, index) => (
                                    <Cell fill={colors[index]} key={entry.name} name={entry.name}/>
                                ))}
                            </Bar>
                        </BarChart>
                        <div className={styles.reviewCategoriesPercentages}>
                            {percentages?.map((p, index) =>
                                <div className={styles.container}>
                                    <div className={styles.circle} style={{backgroundColor: colors[index]}}></div>
                                    <div className={styles.value}>
                                        {p}%
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.line}/>
                    <div className={styles.col2}>
                        {analyticsStore.appliedReviewCategories?.map((data, index) =>
                            <div className={styles.row}>
                                <div className={styles.circle} style={{backgroundColor: colors[index]}}></div>
                                {data.name}
                                <div className={styles.count}>({data.count})</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    const getTaskCategoriesChart = () => {
        const colors = ["#A2A7DE", "#B8DED5", "#B9FFA1", "#C3DEA2", "#DED3AD", "#FF7AED", "#FF926E"]
        const percentages = analyticsStore.appliedTaskCategoriesPercentages

        return (
            <div className={styles.fullWidthRow}>
                <div className={styles.cardHeader}>
                    Количество созданных задач по типу
                </div>
                <div className={styles.reviewCategoriesCard} style={{height: "288px"}}>
                    <div>
                        <BarChart width={612} height={164} data={analyticsStore.appliedTaskCategories}>
                            <Tooltip cursor={{fill: "#EAEEF4"}} contentStyle={{color: "#2F3342"}}
                                     itemStyle={{color: "#9DA1AE"}}
                            />
                            <XAxis dataKey="name" hide={true}/>
                            <Bar dataKey="count" fill="#8884d8" barSize={65} name={"Количество"}>
                                {analyticsStore.appliedTaskCategories?.map((entry, index) => (
                                    <Cell fill={colors[index]} key={entry.name} name={entry.name}/>
                                ))}
                            </Bar>
                        </BarChart>
                        <div className={styles.reviewCategoriesPercentages} style={{margin: "0 20px"}}>
                            {percentages?.map((p, index) =>
                                <div className={styles.container}>
                                    <div className={styles.circle} style={{backgroundColor: colors[index]}}></div>
                                    <div className={styles.value}>
                                        {p}%
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.line} style={{width: "255px", left: "546px", top: "145px"}}/>
                    <div className={styles.col2}>
                        {analyticsStore.appliedTaskCategories?.map((data, index) =>
                            <div className={styles.row}>
                                <div className={styles.circle} style={{backgroundColor: colors[index]}}></div>
                                {data.name}
                                <div className={styles.count}>({data.count})</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    const isReady = analyticsStore.ratingCount &&
        analyticsStore.avgRating &&
        analyticsStore.ratingSeries &&
        analyticsStore.appliedReviewCategories &&
        analyticsStore.appliedTaskCategories

    const renderContent = () => {
        return (
            <div className={styles.layout}>
                {isReady ? (
                    <>
                        <div className={styles.header}>Аналитика</div>
                        {getTopRow()}
                        <div className={styles.divider}/>
                        {analyticsStore.appliedSettingsCount > 0 &&
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
                                    <div className={styles.chips} onClick={(event) => event.stopPropagation()}>
                                        {analyticsStore.period !== "all" &&
                                            <div className={styles.chip}>
                                                Период: {periodOptions.find(
                                                p => p.value === analyticsStore.period)?.name?.toLowerCase()
                                            }
                                                <button className={styles.clearButton}
                                                        onClick={() => analyticsStore.period = "all"}>
                                                    <img src={xMark}/>
                                                </button>
                                            </div>
                                        }
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
                        <div id={"charts"} ref={componentRef} style={{position: "relative"}}>
                            {getRatingCharts()}
                            {getReviewsCategoriesChart()}
                            {getTaskCategoriesChart()}
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
