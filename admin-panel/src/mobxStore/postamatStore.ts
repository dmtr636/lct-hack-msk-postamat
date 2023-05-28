import {makeAutoObservable} from "mobx";
import axios from "axios";
import {domain} from "../constants/config";

class PostamatStore {
    constructor() {
        makeAutoObservable(this)
    }

    regions?: {
        id: number,
        name: string
    }[]

    districts?: {
        id: number,
        name: string,
        region_id: number
    }[]

    postamats?: {
        id: number,
        address: string,
        district_id: number
    }[]

    selectedRegionIds: number[] = []
    selectedDistrictIds: number[] = []
    selectedPostamat?: {
        id: number,
        address: string,
        district_id: number
    }

    searchValue = ""

    getDistrictById(id: number) {
        return this.districts?.find(d => d.id === id)
    }

    getRegionById(id: number) {
        return this.regions?.find((r => r.id === id))
    }

    clearSelection() {
        this.selectedRegionIds = []
        this.selectedDistrictIds = []
        this.selectedPostamat = undefined
    }

    selectAll() {
        this.selectedRegionIds = this.regions?.map(r => r.id) ?? []
        this.selectedDistrictIds = this.districts?.map(d => d.id) ?? []
    }

    isRegionSelected(id: number) {
        return this.selectedRegionIds?.includes(id)
    }

    isDistrictSelected(id: number) {
        return this.selectedDistrictIds?.includes(id)
    }

    getDistrictsByRegionId(id: number) {
        return this.districts?.filter(d => d.region_id === id)
    }

    toggleRegion(id: number) {
        if (this.isRegionSelected(id)) {
            const districtIds = this.getDistrictsByRegionId(id)?.map(d => d.id) ?? []
            this.selectedRegionIds = this.selectedRegionIds?.filter(_id => _id !== id)
            this.selectedDistrictIds = this.selectedDistrictIds.filter(d => !districtIds.includes(d))
        } else {
            this.selectedRegionIds?.push(id)
            this.selectedDistrictIds.push(
                ...(this.districts?.filter(d => d.region_id === id).map(d => d.id) ?? [])
            )
        }
    }

    toggleDistrict(id: number) {
        if (this.isDistrictSelected(id)) {
            this.selectedDistrictIds = this.selectedDistrictIds?.filter(_id => _id !== id)
        } else {
            this.selectedDistrictIds?.push(id)
        }
    }

    groupByFirstLetter(array: any) {
        const unordered = array?.reduce((acc: any, region: any) => {
            const letter = region.name.charAt(0)
            const keyStore = (
                acc[letter] ||     // Does it exist in the object?
                (acc[letter] = []) // If not, create it as an empty array
            );
            keyStore.push(region)

            return acc
        }, {})

        return Object.keys(unordered).sort().reduce(
            (obj: any, key) => {
                obj[key] = unordered[key];
                return obj;
            },
            {}
        );
    }

    get filteredDistricts() {
        if (this.selectedRegionIds.length) {
            return this.districts?.filter(d => this.selectedRegionIds.includes(d.region_id))
        }
        return this.districts
    }

    get searchOptions() {
        return this.postamats?.filter(
            p => p
                .address.toLowerCase().replaceAll(" ", "").replaceAll(",", "").replaceAll(".", "").includes(
                    this.searchValue.toLowerCase().replaceAll(" ", "").replaceAll(",", "").replaceAll(".", "")
                )
        ).slice(0, 5)
    }

    get filteredPostamats() {
        if (this.selectedPostamat) {
            return [this.selectedPostamat]
        }
        if (this.selectedDistrictIds.length) {
            return this.postamats?.filter(p => this.selectedDistrictIds.includes(p.district_id))
        }
        return this.postamats
    }

    async fetchRegions() {
        const res = await axios.get(`${domain}/api/admin/regions`)
        this.regions = res.data
    }

    async fetchDistricts() {
        const res = await axios.get(`${domain}/api/admin/districts`)
        this.districts = res.data
    }

    async fetchPostamats() {
        const res = await axios.get(`${domain}/api/admin/postamats`)
        this.postamats = res.data
    }
}

export const postamatStore = new PostamatStore()
