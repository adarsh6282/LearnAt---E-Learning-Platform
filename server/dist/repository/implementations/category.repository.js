"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    createCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const sName = name.toLowerCase();
            const category = yield this.model.create({ name: sName });
            return category;
        });
    }
    findCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const sName = name.toLowerCase();
            const category = yield this.model.findOne({ name: sName });
            return category;
        });
    }
    findCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.model.findById(id);
            return category;
        });
    }
    getCatgeories(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [category, total] = yield Promise.all([
                this.model.find({}).skip(skip).limit(limit),
                this.model.countDocuments(),
            ]);
            const totalPages = Math.ceil(total / limit);
            return { category, total, totalPages };
        });
    }
    getCatgeoriesInstructor() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.model.find({});
            return categories;
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.model.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
            return category;
        });
    }
    restoreCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.model.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
            return category;
        });
    }
}
exports.CategoryRepository = CategoryRepository;
