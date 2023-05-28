import {makeAutoObservable} from "mobx";
import axios from "axios";
import {domain} from "../constants/config";
import {sources} from "../constants/sources";
import {categories} from "../constants/categories";
import {postamatStore} from "./postamatStore";

export interface IReview {
    id: number,
    comment: string,
    rating: number,
    date: string,
    source_id: number,
    source_name: string,
    postamat_id: string,
    postamat_address: string,
    user_name: string,
    user_phone: string,
    categories: string[],
    category_ids: number[]
}

export const sortOptions = [
    {
        name: "Сначала новые",
        value: "-date"
    },
    {
        name: "Сначала старые",
        value: "date"
    },
    {
        name: "Сначала с наименьшей оценкой",
        value: "rating"
    },
    {
        name: "Сначала с наибольшей оценкой",
        value: "-rating"
    }
]

class ReviewsStore {
    constructor() {
        makeAutoObservable(this)
    }

    reviews?: IReview[]
    ratingFilter = "all"

    selectedReview?: IReview
    selectedCategoryIds: number[] = []
    selectedSourceIds: number[] = []
    searchValue = ""
    sortOptionValue = sortOptions[0].value

    getReviewById(id: number) {
        return this.reviews?.find(r => r.id === id)
    }

    isCategorySelected(id: number) {
        return this.selectedCategoryIds.includes(id)
    }

    isSourceSelected(id: number) {
        return this.selectedSourceIds.includes(id)
    }

    clearCategorySelection() {
        this.selectedCategoryIds = []
    }

    clearSourceSelection() {
        this.selectedSourceIds = []
    }

    clearSelection() {
        this.selectedReview = undefined
        this.selectedSourceIds = []
        this.selectedCategoryIds = []
    }

    selectAll() {
        this.selectedSourceIds = sources?.map(r => r.id) ?? []
        this.selectedCategoryIds = categories?.map(d => d.id) ?? []
    }

    toggleCategory(id: number) {
        if (this.isCategorySelected(id)) {
            this.selectedCategoryIds = this.selectedCategoryIds?.filter(_id => _id !== id)
        } else {
            this.selectedCategoryIds?.push(id)
        }
    }

    toggleSource(id: number) {
        if (this.isSourceSelected(id)) {
            this.selectedSourceIds = this.selectedSourceIds?.filter(_rating => _rating !== id)
        } else {
            this.selectedSourceIds?.push(id)
        }
    }

    getCategoryById(id: number) {
        return categories.find(c => c.id === id)
    }

    getSourceById(id: number) {
        return sources.find(c => c.id === id)
    }

    get filteredReviews() {
        if (this.selectedReview) {
            return [this.selectedReview]
        }
        return this.reviews
    }

    get appliedSettingsCount() {
        let count = 0
        if (this.selectedReview) {
            count++
        } else {
            if (this.ratingFilter !== "all") {
                count++
            }
            if (this.selectedCategoryIds.length) {
                count += this.selectedCategoryIds.length
            }
            if (this.selectedSourceIds.length) {
                count += this.selectedSourceIds.length
            }
            if (postamatStore.selectedPostamat) {
                count++
            } else {
                if (postamatStore.selectedDistrictIds) {
                    count += postamatStore.selectedDistrictIds.length
                }
            }
        }
        return count
    }

    get searchOptions() {
        return this.reviews?.filter(
            r => r.id.toString().includes(this.searchValue.replaceAll("№", ""))
        ).slice(0, 5)
    }

    async fetchReviews() {
        let q = `${domain}/api/admin/reviews?limit=100`;

        if (this.ratingFilter === "5-4") {
            q += `&min_rating=4&max_rating=5`
        } else if (this.ratingFilter === "3") {
            q += `&rating=3`
        } else if (this.ratingFilter === "2-1") {
            q += `&min_rating=1&max_rating=2`
        }

        if (this.selectedCategoryIds.length) {
            q += `&category_ids=${this.selectedCategoryIds.join(",")}`
        }

        if (this.selectedSourceIds.length) {
            q += `&source_ids=${this.selectedSourceIds.join(",")}`
        }

        if (postamatStore.selectedPostamat) {
            q += `&postamat_id=${postamatStore.selectedPostamat.id}`
        } else {
            if (postamatStore.selectedDistrictIds.length) {
                q += `&district_ids=${postamatStore.selectedDistrictIds.join(",")}`
            }
        }

        q += `&ordering=${this.sortOptionValue}`

        const res = await axios.get(q)

        this.reviews = res.data.result
    }
}

export const reviewsStore = new ReviewsStore()
