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
exports.generateCertificate = generateCertificate;
const pdfkit_1 = __importDefault(require("pdfkit"));
function generateCertificate(_a) {
    return __awaiter(this, arguments, void 0, function* ({ name, course, date, }) {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({
                layout: "landscape",
                size: "A4",
            });
            const buffers = [];
            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", reject);
            doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f3f3f3");
            doc.save();
            doc.lineWidth(6);
            doc.strokeColor("#333366");
            doc.rect(37, 37, doc.page.width - 60, doc.page.height - 60).stroke();
            doc.restore();
            doc
                .fontSize(40)
                .fillColor("#333366")
                .font("Times-Bold")
                .text("Certificate of Completion", {
                align: "center",
            });
            doc.moveDown(2);
            doc
                .fontSize(22)
                .fillColor("#444444")
                .font("Times-Roman")
                .text("This certificate is proudly presented to", {
                align: "center",
            });
            doc
                .fontSize(30)
                .fillColor("#000000")
                .font("Times-Bold")
                .text(name, {
                align: "center",
            });
            doc.moveDown(1);
            doc
                .fontSize(20)
                .fillColor("#444444")
                .font("Times-Roman")
                .text(`for successfully completing the course`, {
                align: "center",
            });
            doc
                .fontSize(24)
                .fillColor("#000000")
                .font("Times-Bold")
                .text(course, {
                align: "center",
            });
            doc.moveDown(2);
            doc
                .fontSize(18)
                .fillColor("#666666")
                .text(`Date: ${date.toDateString()}`, {
                align: "right",
                width: doc.page.width - 100,
            });
            doc.end();
        });
    });
}
