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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
class AdminService {
    constructor(adminRepository, instructorRepository) {
        this.adminRepository = adminRepository;
        this.instructorRepository = instructorRepository;
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.adminRepository.getAllUsers();
            return users;
        });
    }
    getAllTutors() {
        return __awaiter(this, void 0, void 0, function* () {
            const instrcutors = yield this.adminRepository.getAllTutors();
            return instrcutors;
        });
    }
    verifyTutor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.instructorRepository.updateTutor(email, true);
        });
    }
    rejectTutor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.instructorRepository.deleteTutor(email);
        });
    }
}
exports.AdminService = AdminService;
