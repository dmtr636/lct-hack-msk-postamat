import {makeAutoObservable} from "mobx";
import axios from "axios";
import {domain} from "../constants/config";
import {sources} from "../constants/sources";
import {categories} from "../constants/categories";
import {postamatStore} from "./postamatStore";
import {IReview} from "./reviewsStore";

export interface ITask {
    id: string,
    name: string,
    created_at: string,
    status: "open" | "in_progress" | "archive",
    review: IReview
}

export const sortOptions = [
    {
        name: "Сначала новые",
        value: "-created_at"
    },
    {
        name: "Сначала старые",
        value: "created_at"
    }
]

class TasksStore {
    constructor() {
        makeAutoObservable(this)
    }

    tasks?: ITask[]
    statusFilter = "open"

    selectedTask?: ITask
    selectedCategoryIds: number[] = []
    selectedSourceIds: number[] = []
    searchValue = ""
    sortOptionValue = sortOptions[0].value

    getTaskById(id: string) {
        return this.tasks?.find(r => r.id === id)
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
        this.selectedTask = undefined
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

    get filteredTasks() {
        if (this.selectedTask) {
            return [this.selectedTask]
        }
        return this.tasks
    }

    get appliedSettingsCount() {
        let count = 0
        if (this.selectedTask) {
            count++
        } else {
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
        return this.tasks?.filter(
            r => r.id.toString().includes(this.searchValue.replaceAll("№", ""))
        ).slice(0, 5)
    }

    async fetchTasks() {
        let q = `${domain}/api/admin/tasks?limit=100`;

        q += `&status=${this.statusFilter}`

        if (this.selectedCategoryIds.length) {
            q += `&category_ids=${this.selectedCategoryIds.join(",")}`
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

        this.tasks = res.data.result
    }
}

export const tasksStore = new TasksStore()
