"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const categoryModel_1 = __importDefault(require("../../models/implementations/categoryModel"));
const base_repository_1 = require("../base.repository");
class CategoryRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(categoryModel_1.default);
    }
    async createCategory(name) {
        const sName = name.toLowerCase();
        const category = await this.model.create({ name: sName });
        return category;
    }
    async findCategory(name) {
        const sName = name.toLowerCase();
        const category = await this.model.findOne({ name: sName });
        return category;
    }
    async findCategoryById(id) {
        const category = await this.model.findById(id);
        return category;
    }
    async getCatgeories(page, limit, search, status) {
        const skip = (page - 1) * limit;
        const query = {};
        if (search) {
            query.$or = [{ name: { $regex: search, $options: "i" } }];
        }
        if (status === "active") {
            query.isDeleted = false;
        }
        else if (status === "inactive") {
            query.isDeleted = true;
        }
        const [category, total] = await Promise.all([
            this.model.find(query).skip(skip).limit(limit),
            this.model.countDocuments(query),
        ]);
        const totalPages = Math.ceil(total / limit);
        return { category, total, totalPages };
    }
    async getCategory() {
        const category = await categoryModel_1.default.find({}, { name: 1, _id: 0 });
        return category.map(cat => cat.name);
    }
    async getCatgeoriesInstructor() {
        const categories = await this.model.find({});
        return categories;
    }
    async deleteCategory(id) {
        const category = await this.model.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        return category;
    }
    async restoreCategory(id) {
        const category = await this.model.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
        return category;
    }
}
exports.CategoryRepository = CategoryRepository;
