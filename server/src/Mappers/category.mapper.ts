import { CategoryDTO } from "../DTO/category.dto";
import { ICategory } from "../models/interfaces/category.interface";

export const toCategoryDTO=(category:ICategory):CategoryDTO=>({
    _id:category._id?.toString(),
    name:category.name,
    isDeleted:category.isDeleted
})

export const toCategoryDTOList=(categories:ICategory[]):CategoryDTO[]=>{
    return categories.map(toCategoryDTO)
}