"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        const document = new this.model(data);
        return await document.save();
    }
    async findAll(filter = {}) {
        return this.model.find(filter);
    }
    async findOne(filter) {
        return this.model.findOne(filter);
    }
    async findById(id) {
        return this.model.findById(id);
    }
    async updateOne(filter, update) {
        return this.model.findOneAndUpdate(filter, update, { new: true });
    }
    async deleteOne(filter) {
        return this.model.findOneAndDelete(filter);
    }
}
exports.BaseRepository = BaseRepository;
