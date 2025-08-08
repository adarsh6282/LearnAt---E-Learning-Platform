import { ICategory } from "../../models/interfaces/category.interface";

export interface ICategoryRepository{
    findCategory(name:string):Promise<ICategory|null>,
    findCategoryById(id:string):Promise<ICategory|null>,
    createCategory(name:string):Promise<ICategory|null>,
    getCatgeories(page:number,limit:number):Promise<{category:ICategory[],total:number,totalPages:number}>,
    getCatgeoriesInstructor():Promise<ICategory[]|null>,
    deleteCategory(id:string):Promise<ICategory|null>
    restoreCategory(id:string):Promise<ICategory|null>
}