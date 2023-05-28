import {makeAutoObservable} from "mobx";
import axios from "axios";
import {domain} from "../constants/config";
import {postamatStore} from "./postamatStore";

class AnalyticsStore {
    constructor() {
        makeAutoObservable(this)
    }

    ratingCount?: {
        rating12: number,
        rating3: number,
        rating45: number
    }

    avgRating?: number

    ratingSeries?: {
        period: string,
        avg_rating: number
    }[]

    appliedReviewCategories?: {
        name: string,
        count: number
    }[]

    appliedTaskCategories?: {
        name: string,
        count: number
    }[]

    period = "all"

    getRatingCountPercentages() {
        if (!this.ratingCount) {
            return [0, 0, 0]
        }
        const totalCount =
            this.ratingCount?.rating12 +
            this.ratingCount?.rating3 +
            this.ratingCount?.rating45;
        return [
            this.ratingCount.rating45 / totalCount * 100,
            this.ratingCount.rating3 / totalCount * 100,
            this.ratingCount.rating12 / totalCount * 100
        ]
    }

    get ratingSeriesFormatted() {
        const index = this.period === "week" ? 2 : this.period === "month" ? 2 : 3;
        return this.ratingSeries?.map(s => ({
            period: s.period.split(".").slice(0, index).join("."),
            avg_rating: s.avg_rating
        })) ?? []
    }

    async fetchRatingCountData() {
        let q1 = `${domain}/api/admin/reviews?limit=1&min_rating=1&max_rating=2&period=${this.period}`
        let q2 = `${domain}/api/admin/reviews?limit=1&rating=3&period=${this.period}`
        let q3 = `${domain}/api/admin/reviews?limit=1&min_rating=4&max_rating=5&period=${this.period}`

        if (postamatStore.selectedPostamat) {
            const q = `&postamat_id=${postamatStore.selectedPostamat.id}`
            q1 += q
            q2 += q
            q3 += q
        } else {
            if (postamatStore.selectedDistrictIds.length) {
                const q = `&district_ids=${postamatStore.selectedDistrictIds.join(",")}`
                q1 += q
                q2 += q
                q3 += q
            }
        }

        const req1 = axios.get(q1)
        const req2 = axios.get(q2)
        const req3 = axios.get(q3)
        const responses = await axios.all([req1, req2, req3])
        this.ratingCount = {
            rating12: responses[0].data.total_count,
            rating3: responses[1].data.total_count,
            rating45: responses[2].data.total_count,
        }
    }

    async fetchAvgRating() {
        let q = `${domain}/api/admin/reviews/avg-rating?period=${this.period}`;
        if (postamatStore.selectedPostamat) {
            q += `&postamat_id=${postamatStore.selectedPostamat.id}`
        } else {
            if (postamatStore.selectedDistrictIds.length) {
                q += `&district_ids=${postamatStore.selectedDistrictIds.join(",")}`
            }
        }
        const res = await axios.get(q)
        this.avgRating = res.data.year_avg;
    }

    async fetchRatingSeries() {
        let q = `${domain}/api/admin/reviews/avg-rating-series?period=${this.period}`
        if (postamatStore.selectedPostamat) {
            q += `&postamat_id=${postamatStore.selectedPostamat.id}`
        } else {
            if (postamatStore.selectedDistrictIds.length) {
                q += `&district_ids=${postamatStore.selectedDistrictIds.join(",")}`
            }
        }
        const res = await axios.get(q)
        this.ratingSeries = res.data;

        const parseDate = (dateStr: string) => {
            const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
            return new Date(dateStr.replace(pattern,'$3-$2-$1'));
        }

        this.ratingSeries?.sort((a,b) => {
            const d1 = parseDate(a.period)
            const d2 = parseDate(b.period)
            return d1 < d2 ? -1 : d1 > d2 ? 1 : 0;
        })
    }

    async fetchAppliedReviewCategories() {
        let q = `${domain}/api/admin/review-categories/applied-count?period=${this.period}`
        if (postamatStore.selectedPostamat) {
            q += `&postamat_id=${postamatStore.selectedPostamat.id}`
        } else {
            if (postamatStore.selectedDistrictIds.length) {
                q += `&district_ids=${postamatStore.selectedDistrictIds.join(",")}`
            }
        }
        const res = await axios.get(q)
        this.appliedReviewCategories = res.data;
    }

    async fetchAppliedTaskCategories() {
        let q = `${domain}/api/admin/task-categories/applied-count?period=${this.period}`
        if (postamatStore.selectedPostamat) {
            q += `&postamat_id=${postamatStore.selectedPostamat.id}`
        } else {
            if (postamatStore.selectedDistrictIds.length) {
                q += `&district_ids=${postamatStore.selectedDistrictIds.join(",")}`
            }
        }
        const res = await axios.get(q)
        this.appliedTaskCategories = res.data;
    }

    get appliedReviewCategoriesPercentages() {
        const totalCount = this.appliedReviewCategories?.reduce((a, b) => a + b.count, 0) ?? 1
        return this.appliedReviewCategories?.map(data =>
            Math.round(data.count / totalCount * 100)
        )
    }

    get appliedTaskCategoriesPercentages() {
        const totalCount = this.appliedTaskCategories?.reduce((a, b) => a + b.count, 0) ?? 1
        return this.appliedTaskCategories?.map(data =>
            Math.round(data.count / totalCount * 100)
        )
    }

    get appliedSettingsCount() {
        let count = 0
        if (this.period !== "all") {
            count++
        }
        if (postamatStore.selectedPostamat) {
            count++
        } else {
            count += postamatStore.selectedDistrictIds.length
        }
        return count
    }
}

export const analyticsStore = new AnalyticsStore()
