import { ICategory } from "../../models/interfaces/category.interface";

export interface ICategoryRepository{
    findCategory(name:string):Promise<ICategory|null>,
    findCategoryById(id:string):Promise<ICategory|null>,
    createCategory(name:string):Promise<ICategory|null>,
    getCatgeories():Promise<ICategory[]>,
    deleteCategory(id:string):Promise<ICategory|null>
    restoreCategory(id:string):Promise<ICategory|null>
}