import {makeAutoObservable} from "mobx";

export class SearchStore {
    constructor() {
        makeAutoObservable(this)
    }
    tasks={}
    reviews={}
    isActive=false
    setTasks= (data) =>{
        this.tasks=data
        console.log(this.tasks);
        this.isActive=true
    }
    setReviews = (data) => {
        this.reviews=data
        console.log(this.reviews);
        this.isActive=true
    }
    setIsActive = () => {
        this.isActive=false
    }
    }

export const searchStore = new SearchStore()