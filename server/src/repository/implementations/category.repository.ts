import { ICategory } from "../../models/interfaces/category.interface";
import { ICategoryRepository } from "../interfaces/category.interface";
import Category from "../../models/implementations/categoryModel";
import { BaseRepository } from "../base.repository";

export class CategoryRepository
  extends BaseRepository<ICategory>
  implements ICategoryRepository
{
  constructor() {
    super(Category);
  }
  async createCategory(name: string): Promise<ICategory | null> {
    const sName = name.toLowerCase();
    const category = await this.model.create({ name: sName });
    return category;
  }

  async findCategory(name: string): Promise<ICategory | null> {
    const sName = name.toLowerCase();
    const category = await this.model.findOne({ name: sName });
    return category;
  }

  async findCategoryById(id: string): Promise<ICategory | null> {
    const category = await this.model.findById(id);
    return category;
  }

  async getCatgeories(
    page: number,
    limit: number
  ): Promise<{ category: ICategory[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [category, total] = await Promise.all([
      this.model.find({}).skip(skip).limit(limit),
      this.model.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return { category, total, totalPages };
  }

  async getCatgeoriesInstructor(): Promise<ICategory[] | null> {
    const categories = await this.model.find({});
    return categories;
  }

  async deleteCategory(id: string): Promise<ICategory | null> {
    const category = await this.model.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    return category;
  }

  async restoreCategory(id: string): Promise<ICategory | null> {
    const category = await this.model.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
    return category;
  }
}
